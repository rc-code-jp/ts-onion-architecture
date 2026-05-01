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
 * タスクグループを削除する
 */
export const createDeleteTaskGroup = (deps: AppDeps) =>
  factory.createHandlers(async (c) => {
    const { taskGroupId } = c.req.param();
    const userId = c.get('userId');

    const taskGroupController = new TaskGroupController(deps);
    const res = await taskGroupController.deleteTaskGroup({
      id: Number(taskGroupId),
      userId,
    });

    return successResponse(
      JSON.stringify({
        id: res,
      }),
    );
  });
