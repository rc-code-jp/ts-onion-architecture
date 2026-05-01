import { TaskController } from '@/interfaces/controllers/TaskController';
import { AppDeps } from '@/interfaces/deps';
import { notFoundResponse, successResponse } from '@/interfaces/http/utils/responses';
import { patchValidation } from '@/interfaces/http/validators/tasks';
import { createFactory } from 'hono/factory';

const factory = createFactory<{
  Variables: {
    userId: number;
  };
}>();

/**
 * タスクを更新
 */
export const createPatchTask = (deps: AppDeps) =>
  factory.createHandlers(patchValidation, async (c) => {
    const { taskId } = c.req.param();
    const body = c.req.valid('json');
    const userId = c.get('userId');

    const taskController = new TaskController(deps);
    const res = await taskController.updateTask({
      id: Number(taskId),
      userId: userId,
      title: body.title,
      description: body.description,
      dueDate: body.dueDate,
      dueTime: body.dueTime,
    });

    if (!res) return notFoundResponse();

    return successResponse(
      JSON.stringify({
        id: res,
      }),
    );
  });
