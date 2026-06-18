import { IRefreshTokenRepository } from '@/application/repositories/IRefreshTokenRepository';
import { ITaskGroupRepository } from '@/application/repositories/ITaskGroupRepository';
import { ITaskRepository } from '@/application/repositories/ITaskRepository';
import { IUserRepository } from '@/application/repositories/IUserRepository';
import { IPasswordHasher } from '@/application/services/IPasswordHasher';
import { ITokenService } from '@/application/services/ITokenService';
import { IUnitOfWork, TransactionalRepositories } from '@/application/services/IUnitOfWork';
import { IUuidGenerator } from '@/application/services/IUuidGenerator';
import { CreateUser } from '@/application/usecases/auth/CreateUser';
import { AlreadyExistsError } from '@/domain/errors/AlreadyExistsError';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('usecase', () => {
  let userRepositoryMock: IUserRepository;
  let refreshTokenRepositoryMock: IRefreshTokenRepository;
  let taskRepositoryMock: ITaskRepository;
  let taskGroupRepositoryMock: ITaskGroupRepository;
  let unitOfWorkMock: IUnitOfWork;
  let passwordHasherMock: IPasswordHasher;
  let tokenServiceMock: ITokenService;
  let uuidGeneratorMock: IUuidGenerator;

  beforeEach(() => {
    userRepositoryMock = {
      findById: vi.fn(),
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({
        id: 1,
        name: 'test',
        email: 'test@example.com',
        hashedPassword: 'HASHED_PASSWORD',
      }),
    };

    refreshTokenRepositoryMock = {
      create: vi.fn(),
      findByUuid: vi.fn(),
      delete: vi.fn(),
      revokeMany: vi.fn(),
    };

    taskRepositoryMock = {
      findOne: vi.fn(),
      findAllByTaskGroupId: vi.fn(),
      findMaxSort: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
      deleteDone: vi.fn(),
      deleteByTaskGroupId: vi.fn(),
    };

    taskGroupRepositoryMock = {
      findAll: vi.fn(),
      findOne: vi.fn(),
      findMaxSort: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
    };

    const repos: TransactionalRepositories = {
      userRepository: userRepositoryMock,
      refreshTokenRepository: refreshTokenRepositoryMock,
      taskRepository: taskRepositoryMock,
      taskGroupRepository: taskGroupRepositoryMock,
    };

    unitOfWorkMock = {
      transaction: vi.fn((work) => work(repos)),
    };

    passwordHasherMock = {
      hash: vi.fn().mockResolvedValue('HASHED_PASSWORD'),
      compare: vi.fn(),
    };

    tokenServiceMock = {
      generateTokens: vi.fn().mockReturnValue({
        accessToken: 'ACCESS_TOKEN',
        refreshToken: 'REFRESH_TOKEN',
      }),
      verifyAccessToken: vi.fn(),
      verifyRefreshToken: vi.fn(),
      hashRefreshToken: vi.fn().mockReturnValue('HASHED_REFRESH_TOKEN'),
    };

    uuidGeneratorMock = {
      generate: vi.fn().mockReturnValue('UUID-FIXED'),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('CreateUser', () => {
    it('creates a user and a refresh token within a single transaction and returns tokens', async () => {
      const usecase = new CreateUser(
        unitOfWorkMock,
        passwordHasherMock,
        tokenServiceMock,
        uuidGeneratorMock,
      );

      const result = await usecase.execute({
        email: 'new@example.com',
        password: 'password',
        name: 'new user',
      });

      expect(result).toEqual({
        accessToken: 'ACCESS_TOKEN',
        refreshToken: 'REFRESH_TOKEN',
      });

      expect(unitOfWorkMock.transaction).toHaveBeenCalledTimes(1);
      expect(passwordHasherMock.hash).toHaveBeenCalledWith('password');
      expect(userRepositoryMock.create).toHaveBeenCalledWith({
        email: 'new@example.com',
        name: 'new user',
        hashedPassword: 'HASHED_PASSWORD',
      });
      expect(refreshTokenRepositoryMock.create).toHaveBeenCalledWith({
        uuid: 'UUID-FIXED',
        hashedToken: 'HASHED_REFRESH_TOKEN',
        userId: 1,
      });
    });

    it('throws AlreadyExistsError when the email is already registered', async () => {
      userRepositoryMock.findByEmail = vi.fn().mockResolvedValue({
        id: 1,
        name: 'existing',
        email: 'taken@example.com',
        hashedPassword: 'HASHED_PASSWORD',
      });

      const usecase = new CreateUser(
        unitOfWorkMock,
        passwordHasherMock,
        tokenServiceMock,
        uuidGeneratorMock,
      );

      await expect(
        usecase.execute({
          email: 'taken@example.com',
          password: 'password',
          name: 'duplicate user',
        }),
      ).rejects.toBeInstanceOf(AlreadyExistsError);

      expect(userRepositoryMock.create).not.toHaveBeenCalled();
      expect(refreshTokenRepositoryMock.create).not.toHaveBeenCalled();
    });
  });
});
