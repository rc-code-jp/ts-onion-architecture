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
 * タスクを削除する
 */
export const createDeleteTask = (deps: AppDeps) =>
  factory.createHandlers(async (c) => {
    const { taskId } = c.req.param();
    const userId = c.get('userId');

    const taskController = new TaskController(deps);
    const res = await taskController.deleteTask({
      id: Number(taskId),
      userId: userId,
    });

    return successResponse(
      JSON.stringify({
        id: res,
      }),
    );
  });
