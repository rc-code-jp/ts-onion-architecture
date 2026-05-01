import { IUnitOfWork, TransactionalRepositories } from '@/application/services/IUnitOfWork';
import { RefreshTokenRepository } from '@/infrastructure/repository/RefreshTokenRepository';
import { TaskGroupRepository } from '@/infrastructure/repository/TaskGroupRepository';
import { TaskRepository } from '@/infrastructure/repository/TaskRepository';
import { UserRepository } from '@/infrastructure/repository/UserRepository';
import { PrismaClient } from '@prisma/client';

export class PrismaUnitOfWork implements IUnitOfWork {
  constructor(private db: PrismaClient) {}

  async transaction<T>(work: (repos: TransactionalRepositories) => Promise<T>): Promise<T> {
    return this.db.$transaction(async (tx) => {
      return work({
        userRepository: new UserRepository(tx),
        refreshTokenRepository: new RefreshTokenRepository(tx),
        taskRepository: new TaskRepository(tx),
        taskGroupRepository: new TaskGroupRepository(tx),
      });
    });
  }
}
