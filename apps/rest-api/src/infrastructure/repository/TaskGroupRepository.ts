import { ITaskGroupRepository } from '@/application/repositories/ITaskGroupRepository';
import { TaskGroupModel } from '@/domain/models/TaskGroupModel';
import { Sort } from '@/domain/values/Sort';
import { Prisma } from '@prisma/client';

export class TaskGroupRepository implements ITaskGroupRepository {
  constructor(private db: Prisma.TransactionClient) {}

  async findAll(params: { userId: number }): Promise<TaskGroupModel[]> {
    const list = await this.db.taskGroup.findMany({
      select: {
        id: true,
        userId: true,
        name: true,
        sort: true,
      },
      where: {
        userId: params.userId,
      },
      orderBy: {
        sort: 'asc',
      },
    });
    const models = list.map(
      (item) =>
        new TaskGroupModel({
          id: item.id,
          userId: item.userId,
          name: item.name,
          sort: Sort.of(item.sort),
        }),
    );
    return models;
  }

  async findOne(params: { id: number; userId: number }): Promise<TaskGroupModel | null> {
    const item = await this.db.taskGroup.findFirst({
      where: {
        id: params.id,
        userId: params.userId,
      },
    });

    if (!item) return null;

    return new TaskGroupModel({
      id: item.id,
      userId: item.userId,
      name: item.name,
      sort: Sort.of(item.sort),
    });
  }

  async findMaxSort(params: { userId: number }): Promise<number> {
    const item = await this.db.taskGroup.findFirst({
      select: { sort: true },
      where: { userId: params.userId },
      orderBy: { sort: 'desc' },
    });
    if (!item) {
      return 0;
    }
    return item.sort;
  }

  async save(params: { item: TaskGroupModel }): Promise<TaskGroupModel> {
    const item = params.item;

    if (item.id) {
      await this.db.taskGroup.update({
        where: { id: item.id },
        data: {
          name: item.name,
          sort: item.sort.value,
        },
      });
      return item;
    }
    const res = await this.db.taskGroup.create({
      data: {
        userId: item.userId,
        name: item.name,
        sort: item.sort.value,
      },
    });
    return new TaskGroupModel({
      id: res.id,
      userId: res.userId,
      name: res.name,
      sort: Sort.of(res.sort),
    });
  }

  async delete(params: { item: TaskGroupModel }): Promise<number> {
    const item = await this.db.taskGroup.delete({
      where: {
        id: params.item.id,
      },
    });

    return item.id;
  }
}
