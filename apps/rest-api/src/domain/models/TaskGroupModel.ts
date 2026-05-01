import { BaseModel } from './BaseModel';

export class TaskGroupModel extends BaseModel {
  readonly userId: number;
  readonly name: string;
  readonly sort: number;

  static readonly INITIAL_SORT_VALUE = 65535;

  constructor(props: {
    id: number;
    userId: number;
    name: string;
    sort: number;
  }) {
    super({ id: props.id });
    this.userId = props.userId;
    this.name = props.name;
    this.sort = props.sort;
  }

  static createNew(props: {
    userId: number;
    name: string;
    maxSort: number;
  }): TaskGroupModel {
    return new TaskGroupModel({
      id: 0,
      userId: props.userId,
      name: props.name,
      sort: Math.floor(props.maxSort) + TaskGroupModel.INITIAL_SORT_VALUE,
    });
  }

  static sortBetween(prev: number | null, next: number | null): number {
    const prevSort = prev ?? 0;
    const nextSort = next ?? TaskGroupModel.INITIAL_SORT_VALUE;
    return (prevSort + nextSort) / 2;
  }

  withUpdates(
    updates: Partial<{
      name: string;
      sort: number;
    }>,
  ): TaskGroupModel {
    return new TaskGroupModel({
      id: this.id,
      userId: this.userId,
      name: updates.name ?? this.name,
      sort: updates.sort ?? this.sort,
    });
  }
}
