import { ITaskGroupRepository } from '@/application/repositories/ITaskGroupRepository';
import { NotFoundError } from '@/domain/errors/NotFoundError';
import { TaskGroupModel } from '@/domain/models/TaskGroupModel';

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

    let prevSort: number | null = null;
    if (params.prevId) {
      const prevModel = await this.repository.findOne({
        id: params.prevId,
        userId: params.userId,
      });
      if (!prevModel) {
        throw new NotFoundError('TaskGroup not found');
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
        throw new NotFoundError('TaskGroup not found');
      }
      nextSort = nextModel.sort;
    }

    const updated = model.withUpdates({
      sort: TaskGroupModel.sortBetween(prevSort, nextSort),
    });

    return await this.repository.save({ item: updated });
  }
}
