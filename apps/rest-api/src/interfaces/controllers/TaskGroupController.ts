import { CreateTaskGroup } from '@/application/usecases/taskGroup/CreateTaskGroup';
import { DeleteTaskGroup } from '@/application/usecases/taskGroup/DeleteTaskGroup';
import { GetTaskGroup } from '@/application/usecases/taskGroup/GetTaskGroup';
import { GetTaskGroupList } from '@/application/usecases/taskGroup/GetTaskGroupList';
import { UpdateTaskGroup } from '@/application/usecases/taskGroup/UpdateTaskGroup';
import { UpdateTaskGroupSort } from '@/application/usecases/taskGroup/UpdateTaskGroupSort';
import { AppDeps } from '@/interfaces/deps';

export class TaskGroupController {
  constructor(private deps: AppDeps) {}

  async getTaskGroup(params: {
    id: number;
    userId: number;
  }) {
    const usecase = new GetTaskGroup(this.deps.taskGroupRepository);
    const item = await usecase.execute({
      id: params.id,
      userId: params.userId,
    });

    return item;
  }

  async getTaskGroupList(params: {
    userId: number;
  }) {
    const usecase = new GetTaskGroupList(this.deps.taskGroupRepository);
    const list = await usecase.execute(params.userId);

    return list;
  }

  async createTaskGroup(params: {
    userId: number;
    name: string;
  }) {
    const usecase = new CreateTaskGroup(this.deps.taskGroupRepository);
    const item = await usecase.execute({
      name: params.name,
      userId: params.userId,
    });

    return item.id;
  }

  async updateTaskGroup(params: {
    id: number;
    userId: number;
    name: string;
  }) {
    const usecase = new UpdateTaskGroup(this.deps.taskGroupRepository);
    const item = await usecase.execute({
      userId: params.userId,
      taskGroupId: params.id,
      name: params.name,
    });

    return item.id;
  }

  async deleteTaskGroup(params: {
    id: number;
    userId: number;
  }) {
    const usecase = new DeleteTaskGroup(this.deps.taskGroupRepository);
    const res = await usecase.execute({
      taskGroupId: params.id,
      userId: params.userId,
    });

    return res;
  }

  async updateTaskGroupSort(params: {
    id: number;
    userId: number;
    prevId?: number;
    nextId?: number;
  }) {
    const usecase = new UpdateTaskGroupSort(this.deps.taskGroupRepository);
    const item = await usecase.execute({
      taskGroupId: params.id,
      userId: params.userId,
      prevId: params.prevId,
      nextId: params.nextId,
    });

    return item.id;
  }
}
