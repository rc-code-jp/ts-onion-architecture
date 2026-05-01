import { TaskController } from '@/interfaces/controllers/TaskController';
import { AppDeps } from '@/interfaces/deps';
import { notFoundResponse, successResponse } from '@/interfaces/http/utils/responses';
import { patchDoneValidation } from '@/interfaces/http/validators/tasks';
import { createFactory } from 'hono/factory';

const factory = createFactory<{
  Variables: {
    userId: number;
  };
}>();

/**
 * タスクの完了状態を変更
 */
export const createPatchTaskDone = (deps: AppDeps) =>
  factory.createHandlers(patchDoneValidation, async (c) => {
    const { taskId } = c.req.param();
    const body = c.req.valid('json');
    const userId = c.get('userId');

    const taskController = new TaskController(deps);
    const res = await taskController.updateTaskDone({
      id: Number(taskId),
      userId: userId,
      done: body.done,
    });

    if (!res) return notFoundResponse();

    return successResponse(
      JSON.stringify({
        id: res,
      }),
    );
  });
