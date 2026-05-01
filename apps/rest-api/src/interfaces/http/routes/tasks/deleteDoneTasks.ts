import { TaskController } from '@/interfaces/controllers/TaskController';
import { AppDeps } from '@/interfaces/deps';
import { successResponse } from '@/interfaces/http/utils/responses';
import { createFactory } from 'hono/factory';

const factory = createFactory<{
  Variables: {
    userId: number;
  };
}>();

/**
 * 完了したタスクを削除する
 */
export const createDeleteDoneTasks = (deps: AppDeps) =>
  factory.createHandlers(async (c) => {
    const { taskGroupId } = c.req.queries();
    const userId = c.get('userId');

    const taskController = new TaskController(deps);
    const res = await taskController.deleteDoneTasks({
      userId: userId,
      taskGroupId: taskGroupId ? Number(taskGroupId) : undefined,
    });

    return successResponse(
      JSON.stringify({
        count: res,
      }),
    );
  });
