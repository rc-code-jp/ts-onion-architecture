import { TaskGroupController } from '@/interfaces/controllers/TaskGroupController';
import { AppDeps } from '@/interfaces/deps';
import { successResponse } from '@/interfaces/http/utils/responses';
import { createFactory } from 'hono/factory';

const factory = createFactory<{
  Variables: {
    userId: number;
  };
}>();

/**
 * タスクグループ一覧取得
 */
export const createGetTaskGroupList = (deps: AppDeps) =>
  factory.createHandlers(async (c) => {
    const userId = c.get('userId');

    const taskGroupController = new TaskGroupController(deps);
    const list = await taskGroupController.getTaskGroupList({
      userId,
    });

    return successResponse(
      JSON.stringify({
        list: list,
      }),
    );
  });
