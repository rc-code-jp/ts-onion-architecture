import { TaskGroupController } from '@/interfaces/controllers/TaskGroupController';
import { AppDeps } from '@/interfaces/deps';
import { notFoundResponse, successResponse } from '@/interfaces/http/utils/responses';
import { createFactory } from 'hono/factory';

const factory = createFactory<{
  Variables: {
    userId: number;
  };
}>();

/**
 * タスクグループ詳細取得
 */
export const createGetTaskGroup = (deps: AppDeps) =>
  factory.createHandlers(async (c) => {
    const { taskGroupId } = c.req.param();
    const userId = c.get('userId');

    const taskGroupController = new TaskGroupController(deps);
    const res = await taskGroupController.getTaskGroup({
      id: Number(taskGroupId),
      userId,
    });

    if (!res) {
      return notFoundResponse();
    }

    return successResponse(
      JSON.stringify({
        item: { ...res.taskGroup, tasks: res.tasks },
      }),
    );
  });
