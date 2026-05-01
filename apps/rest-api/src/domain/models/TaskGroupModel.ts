import { Sort } from '@/domain/values/Sort';
import { BaseModel } from './BaseModel';

export class TaskGroupModel extends BaseModel {
  readonly userId: number;
  readonly name: string;
  readonly sort: Sort;

  constructor(props: {
    id: number;
    userId: number;
    name: string;
    sort: Sort;
  }) {
    super({ id: props.id });
    this.userId = props.userId;
    this.name = props.name;
    this.sort = props.sort;
  }

  static createNew(props: {
    userId: number;
    name: string;
    afterMaxSort: number;
  }): TaskGroupModel {
    return new TaskGroupModel({
      id: 0,
      userId: props.userId,
      name: props.name,
      sort: Sort.appendAfter(props.afterMaxSort),
    });
  }

  rename(name: string): TaskGroupModel {
    if (this.name === name) return this;
    return new TaskGroupModel({
      id: this.id,
      userId: this.userId,
      name,
      sort: this.sort,
    });
  }

  reorderBetween(prev: Sort | null, next: Sort | null): TaskGroupModel {
    return new TaskGroupModel({
      id: this.id,
      userId: this.userId,
      name: this.name,
      sort: Sort.between(prev, next),
    });
  }
}
