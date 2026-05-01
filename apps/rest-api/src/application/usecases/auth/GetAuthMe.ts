import { IUserRepository } from '@/application/repositories/IUserRepository';
import { NotFoundError } from '@/domain/errors/NotFoundError';

export class GetAuthMe {
  constructor(private repository: IUserRepository) {}

  async execute(params: { userId: number }) {
    const user = await this.repository.findById({ id: params.userId });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return {
      user,
    };
  }
}
