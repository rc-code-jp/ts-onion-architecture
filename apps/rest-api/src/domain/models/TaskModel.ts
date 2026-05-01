import { BaseModel } from './BaseModel';

export class TaskModel extends BaseModel {
  readonly taskGroupId: number;
  readonly title: string;
  readonly done?: boolean;
  readonly description?: string;
  readonly dueDate?: string;
  readonly dueTime?: string;
  readonly sort: number;

  static readonly INITIAL_SORT_VALUE = 65535;

  constructor(props: {
    id: number;
    taskGroupId: number;
    title: string;
    done?: boolean;
    description?: string;
    dueDate?: string;
    dueTime?: string;
    sort: number;
  }) {
    super({ id: props.id });
    this.taskGroupId = props.taskGroupId;
    this.title = props.title;
    this.done = props.done;
    this.description = props.description;
    this.dueDate = props.dueDate;
    this.dueTime = props.dueTime;
    this.sort = props.sort;
  }

  static createNew(props: {
    taskGroupId: number;
    title: string;
    description?: string;
    dueDate?: string;
    dueTime?: string;
    maxSort: number;
  }): TaskModel {
    return new TaskModel({
      id: 0,
      taskGroupId: props.taskGroupId,
      title: props.title,
      description: props.description,
      dueDate: props.dueDate,
      dueTime: props.dueTime,
      sort: Math.floor(props.maxSort) + TaskModel.INITIAL_SORT_VALUE,
    });
  }

  static sortBetween(prev: number | null, next: number | null): number {
    const prevSort = prev ?? 0;
    const nextSort = next ?? TaskModel.INITIAL_SORT_VALUE;
    return (prevSort + nextSort) / 2;
  }

  withUpdates(
    updates: Partial<{
      title: string;
      description: string;
      dueDate: string;
      dueTime: string;
      done: boolean;
      sort: number;
    }>,
  ): TaskModel {
    return new TaskModel({
      id: this.id,
      taskGroupId: this.taskGroupId,
      title: updates.title ?? this.title,
      description: updates.description ?? this.description,
      dueDate: updates.dueDate ?? this.dueDate,
      dueTime: updates.dueTime ?? this.dueTime,
      done: updates.done ?? this.done,
      sort: updates.sort ?? this.sort,
    });
  }
}
