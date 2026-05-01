import { IRefreshTokenRepository } from '@/application/repositories/IRefreshTokenRepository';
import { IUserRepository } from '@/application/repositories/IUserRepository';
import { IPasswordHasher } from '@/application/services/IPasswordHasher';
import { ITokenService } from '@/application/services/ITokenService';
import { IUuidGenerator } from '@/application/services/IUuidGenerator';
import { SignIn } from '@/application/usecases/auth/SignIn';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('usecase', () => {
  let userRepositoryMock: IUserRepository;
  let refreshTokenRepositoryMock: IRefreshTokenRepository;
  let passwordHasherMock: IPasswordHasher;
  let tokenServiceMock: ITokenService;
  let uuidGeneratorMock: IUuidGenerator;

  beforeEach(() => {
    userRepositoryMock = {
      findById: vi.fn(),
      findByEmail: vi.fn().mockResolvedValue({
        id: 1,
        name: 'test',
        email: 'test@example.com',
        hashedPassword: 'HASHED_PASSWORD',
      }),
      create: vi.fn(),
    };

    refreshTokenRepositoryMock = {
      create: vi.fn(),
      findByUuid: vi.fn(),
      delete: vi.fn(),
      revokeMany: vi.fn(),
    };

    passwordHasherMock = {
      hash: vi.fn().mockResolvedValue('HASHED_PASSWORD'),
      compare: vi.fn().mockResolvedValue(true),
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

  describe('SignIn', () => {
    it('should return access token and refresh token', async () => {
      const signIn = new SignIn(
        userRepositoryMock,
        refreshTokenRepositoryMock,
        passwordHasherMock,
        tokenServiceMock,
        uuidGeneratorMock,
      );
      const result = await signIn.execute({
        email: 'example@examp.com',
        password: 'password',
      });

      expect(result).toEqual({
        accessToken: 'ACCESS_TOKEN',
        refreshToken: 'REFRESH_TOKEN',
      });
      expect(refreshTokenRepositoryMock.create).toHaveBeenCalledWith({
        uuid: 'UUID-FIXED',
        hashedToken: 'HASHED_REFRESH_TOKEN',
        userId: 1,
      });
    });
  });
});
