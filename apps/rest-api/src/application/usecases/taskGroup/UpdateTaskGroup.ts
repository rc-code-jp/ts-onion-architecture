import { ITaskGroupRepository } from '@/application/repositories/ITaskGroupRepository';
import { NotFoundError } from '@/domain/errors/NotFoundError';

export class UpdateTaskGroup {
  constructor(private repository: ITaskGroupRepository) {}

  async execute(params: {
    userId: number;
    taskGroupId: number;
    name?: string;
    sort?: number;
  }) {
    const model = await this.repository.findOne({
      id: params.taskGroupId,
      userId: params.userId,
    });
    if (!model) {
      throw new NotFoundError('TaskGroup not found');
    }

    const updated = model.withUpdates({
      name: params.name,
      sort: params.sort,
    });

    return await this.repository.save({ item: updated });
  }
}
