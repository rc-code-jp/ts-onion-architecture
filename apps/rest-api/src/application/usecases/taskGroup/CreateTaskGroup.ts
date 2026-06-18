import { ITaskGroupRepository } from '@/application/repositories/ITaskGroupRepository';
import { TaskGroupModel } from '@/domain/models/TaskGroupModel';

export class CreateTaskGroup {
  constructor(private repository: ITaskGroupRepository) {}

  async execute(params: { userId: number; name: string }) {
    const maxSort = await this.repository.findMaxSort({ userId: params.userId });

    const model = TaskGroupModel.createNew({
      userId: params.userId,
      name: params.name,
      afterMaxSort: maxSort,
    });
    return await this.repository.save({ item: model });
  }
}
