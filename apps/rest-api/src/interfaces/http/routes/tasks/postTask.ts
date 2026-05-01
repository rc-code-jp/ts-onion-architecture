import { TaskController } from '@/interfaces/controllers/TaskController';
import { AppDeps } from '@/interfaces/deps';
import { successResponse } from '@/interfaces/http/utils/responses';
import { postValidation } from '@/interfaces/http/validators/tasks';
import { createFactory } from 'hono/factory';

const factory = createFactory<{
  Variables: {
    userId: number;
  };
}>();

/**
 * タスク作成
 */
export const createPostTask = (deps: AppDeps) =>
  factory.createHandlers(postValidation, async (c) => {
    const body = c.req.valid('json');
    const userId = c.get('userId');

    const taskController = new TaskController(deps);
    const res = await taskController.createTask({
      userId: userId,
      taskGroupId: body.taskGroupId,
      title: body.title,
      description: body.description,
      dueDate: body.dueDate,
      dueTime: body.dueTime,
    });

    return successResponse(
      JSON.stringify({
        id: res,
      }),
    );
  });
