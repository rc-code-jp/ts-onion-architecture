import { Sort } from '@/domain/values/Sort';
import { BaseModel } from './BaseModel';

export class TaskModel extends BaseModel {
  readonly taskGroupId: number;
  readonly title: string;
  readonly done: boolean;
  readonly description?: string;
  readonly dueDate?: string;
  readonly dueTime?: string;
  readonly sort: Sort;

  constructor(props: {
    id: number;
    taskGroupId: number;
    title: string;
    done?: boolean;
    description?: string;
    dueDate?: string;
    dueTime?: string;
    sort: Sort;
  }) {
    super({ id: props.id });
    this.taskGroupId = props.taskGroupId;
    this.title = props.title;
    this.done = props.done ?? false;
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
    afterMaxSort: number;
  }): TaskModel {
    return new TaskModel({
      id: 0,
      taskGroupId: props.taskGroupId,
      title: props.title,
      description: props.description,
      dueDate: props.dueDate,
      dueTime: props.dueTime,
      sort: Sort.appendAfter(props.afterMaxSort),
    });
  }

  changeContent(
    updates: Partial<{
      title: string;
      description: string;
      dueDate: string;
      dueTime: string;
    }>,
  ): TaskModel {
    return new TaskModel({
      id: this.id,
      taskGroupId: this.taskGroupId,
      title: updates.title ?? this.title,
      description: updates.description ?? this.description,
      dueDate: updates.dueDate ?? this.dueDate,
      dueTime: updates.dueTime ?? this.dueTime,
      done: this.done,
      sort: this.sort,
    });
  }

  markDone(done: boolean): TaskModel {
    if (this.done === done) return this;
    return new TaskModel({
      id: this.id,
      taskGroupId: this.taskGroupId,
      title: this.title,
      description: this.description,
      dueDate: this.dueDate,
      dueTime: this.dueTime,
      done,
      sort: this.sort,
    });
  }

  reorderBetween(prev: Sort | null, next: Sort | null): TaskModel {
    return new TaskModel({
      id: this.id,
      taskGroupId: this.taskGroupId,
      title: this.title,
      description: this.description,
      dueDate: this.dueDate,
      dueTime: this.dueTime,
      done: this.done,
      sort: Sort.between(prev, next),
    });
  }
}
