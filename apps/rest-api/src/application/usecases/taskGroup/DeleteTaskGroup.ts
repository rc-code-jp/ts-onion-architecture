import { IUnitOfWork } from '@/application/services/IUnitOfWork';
import { NotFoundError } from '@/domain/errors/NotFoundError';

export class DeleteTaskGroup {
  constructor(private unitOfWork: IUnitOfWork) {}

  async execute(params: { userId: number; taskGroupId: number }) {
    return this.unitOfWork.transaction(async (repos) => {
      const model = await repos.taskGroupRepository.findOne({
        id: params.taskGroupId,
        userId: params.userId,
      });
      if (!model) {
        throw new NotFoundError('TaskGroup not found');
      }
      // 外部キー制約のため、先に配下の Task を削除する
      await repos.taskRepository.deleteByTaskGroupId({ taskGroupId: model.id });
      return repos.taskGroupRepository.delete({ item: model });
    });
  }
}
