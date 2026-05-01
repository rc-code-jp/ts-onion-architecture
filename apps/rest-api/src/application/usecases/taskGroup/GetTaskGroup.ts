import { ITaskGroupRepository } from '@/application/repositories/ITaskGroupRepository';
import { ITaskRepository } from '@/application/repositories/ITaskRepository';
import { TaskGroupModel } from '@/domain/models/TaskGroupModel';
import { TaskModel } from '@/domain/models/TaskModel';

export type GetTaskGroupResult = {
  taskGroup: TaskGroupModel;
  tasks: TaskModel[];
};

export class GetTaskGroup {
  constructor(
    private taskGroupRepository: ITaskGroupRepository,
    private taskRepository: ITaskRepository,
  ) {}

  async execute(params: { id: number; userId: number }): Promise<GetTaskGroupResult | null> {
    const taskGroup = await this.taskGroupRepository.findOne({
      id: params.id,
      userId: params.userId,
    });
    if (!taskGroup) return null;

    const tasks = await this.taskRepository.findAllByTaskGroupId({ taskGroupId: taskGroup.id });

    return { taskGroup, tasks };
  }
}
