import { ITaskRepository } from '@/application/repositories/ITaskRepository';
import { NotFoundError } from '@/domain/errors/NotFoundError';
import { TaskModel } from '@/domain/models/TaskModel';

export class UpdateTaskSort {
  constructor(private repository: ITaskRepository) {}

  async execute(params: {
    userId: number;
    taskId: number;
    prevId?: number;
    nextId?: number;
  }) {
    const model = await this.repository.findOne({
      id: params.taskId,
      userId: params.userId,
    });
    if (!model) {
      throw new NotFoundError('Task not found');
    }

    let prevSort: number | null = null;
    if (params.prevId) {
      const prevModel = await this.repository.findOne({
        id: params.prevId,
        userId: params.userId,
      });
      if (!prevModel) {
        throw new NotFoundError('Task not found');
      }
      prevSort = prevModel.sort;
    }

    let nextSort: number | null = null;
    if (params.nextId) {
      const nextModel = await this.repository.findOne({
        id: params.nextId,
        userId: params.userId,
      });
      if (!nextModel) {
        throw new NotFoundError('Task not found');
      }
      nextSort = nextModel.sort;
    }

    const updated = model.withUpdates({
      sort: TaskModel.sortBetween(prevSort, nextSort),
    });

    return await this.repository.save({ item: updated });
  }
}
