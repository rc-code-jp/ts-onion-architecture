import { IRefreshTokenRepository } from '@/application/repositories/IRefreshTokenRepository';
import { ITaskGroupRepository } from '@/application/repositories/ITaskGroupRepository';
import { ITaskRepository } from '@/application/repositories/ITaskRepository';
import { IUserRepository } from '@/application/repositories/IUserRepository';

export interface TransactionalRepositories {
  userRepository: IUserRepository;
  refreshTokenRepository: IRefreshTokenRepository;
  taskRepository: ITaskRepository;
  taskGroupRepository: ITaskGroupRepository;
}

export interface IUnitOfWork {
  transaction<T>(work: (repos: TransactionalRepositories) => Promise<T>): Promise<T>;
}
