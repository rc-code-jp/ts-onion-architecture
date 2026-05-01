import { ITaskGroupRepository } from '@/application/repositories/ITaskGroupRepository';
import { NotFoundError } from '@/domain/errors/NotFoundError';

export class UpdateTaskGroupSort {
  constructor(private repository: ITaskGroupRepository) {}

  async execute(params: {
    userId: number;
    taskGroupId: number;
    prevId?: number;
    nextId?: number;
  }) {
    const model = await this.repository.findOne({
      id: params.taskGroupId,
      userId: params.userId,
    });
    if (!model) {
      throw new NotFoundError('TaskGroup not found');
    }

    let prev = null;
    if (params.prevId) {
      const prevModel = await this.repository.findOne({
        id: params.prevId,
        userId: params.userId,
      });
      if (!prevModel) {
        throw new NotFoundError('TaskGroup not found');
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
        throw new NotFoundError('TaskGroup not found');
      }
      next = nextModel.sort;
    }

    const updated = model.reorderBetween(prev, next);

    return await this.repository.save({ item: updated });
  }
}
