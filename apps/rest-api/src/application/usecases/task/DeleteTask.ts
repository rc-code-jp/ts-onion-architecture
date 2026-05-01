import { ITaskRepository } from '@/application/repositories/ITaskRepository';
import { NotFoundError } from '@/domain/errors/NotFoundError';

export class DeleteTask {
  constructor(private repository: ITaskRepository) {}

  async execute(params: { userId: number; taskId: number }) {
    const model = await this.repository.findOne({
      id: params.taskId,
      userId: params.userId,
    });
    if (!model) {
      throw new NotFoundError('Task not found');
    }
    return await this.repository.delete({ item: model });
  }
}
