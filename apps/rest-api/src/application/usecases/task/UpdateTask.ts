import { ITaskRepository } from '@/application/repositories/ITaskRepository';
import { NotFoundError } from '@/domain/errors/NotFoundError';

export class UpdateTask {
  constructor(private repository: ITaskRepository) {}

  async execute(params: {
    userId: number;
    taskId: number;
    title?: string;
    description?: string;
    dueDate?: string;
    dueTime?: string;
    done?: boolean;
  }) {
    const model = await this.repository.findOne({
      id: params.taskId,
      userId: params.userId,
    });
    if (!model) {
      throw new NotFoundError('Task not found');
    }

    let updated = model.changeContent({
      title: params.title,
      description: params.description,
      dueDate: params.dueDate,
      dueTime: params.dueTime,
    });
    if (params.done !== undefined) {
      updated = updated.markDone(params.done);
    }

    return await this.repository.save({ item: updated });
  }
}
