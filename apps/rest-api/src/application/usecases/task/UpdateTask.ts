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
    sort?: number;
  }) {
    const model = await this.repository.findOne({
      id: params.taskId,
      userId: params.userId,
    });
    if (!model) {
      throw new NotFoundError('Task not found');
    }

    const updated = model.withUpdates({
      title: params.title,
      description: params.description,
      dueDate: params.dueDate,
      dueTime: params.dueTime,
      done: params.done,
      sort: params.sort,
    });

    return await this.repository.save({ item: updated });
  }
}
