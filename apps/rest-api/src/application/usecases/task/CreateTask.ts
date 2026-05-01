import { ITaskRepository } from '@/application/repositories/ITaskRepository';
import { TaskModel } from '@/domain/models/TaskModel';

export class CreateTask {
  constructor(private repository: ITaskRepository) {}

  async execute(params: {
    userId: number;
    taskGroupId: number;
    title: string;
    description?: string;
    dueDate?: string;
    dueTime?: string;
  }) {
    const maxSort = await this.repository.findMaxSort({
      taskGroupId: params.taskGroupId,
      userId: params.userId,
    });

    const model = TaskModel.createNew({
      taskGroupId: params.taskGroupId,
      title: params.title,
      description: params.description,
      dueDate: params.dueDate,
      dueTime: params.dueTime,
      maxSort,
    });
    return await this.repository.save({ item: model });
  }
}
