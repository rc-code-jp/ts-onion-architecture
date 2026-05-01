import { IRefreshTokenRepository } from '@/application/repositories/IRefreshTokenRepository';
import { ITaskGroupRepository } from '@/application/repositories/ITaskGroupRepository';
import { ITaskRepository } from '@/application/repositories/ITaskRepository';
import { IUserRepository } from '@/application/repositories/IUserRepository';
import { IPasswordHasher } from '@/application/services/IPasswordHasher';
import { ITokenService } from '@/application/services/ITokenService';
import { IUuidGenerator } from '@/application/services/IUuidGenerator';

export interface AppDeps {
  userRepository: IUserRepository;
  refreshTokenRepository: IRefreshTokenRepository;
  taskRepository: ITaskRepository;
  taskGroupRepository: ITaskGroupRepository;
  passwordHasher: IPasswordHasher;
  tokenService: ITokenService;
  uuidGenerator: IUuidGenerator;
}
