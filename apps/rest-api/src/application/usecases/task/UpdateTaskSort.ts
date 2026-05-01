import { ITaskRepository } from '@/application/repositories/ITaskRepository';
import { NotFoundError } from '@/domain/errors/NotFoundError';

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

    let prev = null;
    if (params.prevId) {
      const prevModel = await this.repository.findOne({
        id: params.prevId,
        userId: params.userId,
      });
      if (!prevModel) {
        throw new NotFoundError('Task not found');
      }
      prev = prevModel.sort;
    }

    let next = null;
    if (params.nextId) {
      const nextModel = await this.repository.findOne({
        id: params.nextId,
        userId: params.userId,
      });
      if (!nextModel) {
        throw new NotFoundError('Task not found');
      }
      next = nextModel.sort;
    }

    const updated = model.reorderBetween(prev, next);

    return await this.repository.save({ item: updated });
  }
}
