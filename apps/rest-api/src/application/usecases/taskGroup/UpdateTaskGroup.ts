import { ITaskGroupRepository } from '@/application/repositories/ITaskGroupRepository';
import { NotFoundError } from '@/domain/errors/NotFoundError';

export class UpdateTaskGroup {
  constructor(private repository: ITaskGroupRepository) {}

  async execute(params: { userId: number; taskGroupId: number; name: string }) {
    const model = await this.repository.findOne({
      id: params.taskGroupId,
      userId: params.userId,
    });
    if (!model) {
      throw new NotFoundError('TaskGroup not found');
    }

    const updated = model.rename(params.name);

    return await this.repository.save({ item: updated });
  }
}
