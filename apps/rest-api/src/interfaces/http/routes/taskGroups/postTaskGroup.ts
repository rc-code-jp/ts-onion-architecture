import { TaskGroupController } from '@/interfaces/controllers/TaskGroupController';
import { AppDeps } from '@/interfaces/deps';
import { successResponse } from '@/interfaces/http/utils/responses';
import { postValidation } from '@/interfaces/http/validators/taskGroups';
import { createFactory } from 'hono/factory';

const factory = createFactory<{
  Variables: {
    userId: number;
  };
}>();

/**
 * タスクグループ作成
 */
export const createPostTaskGroup = (deps: AppDeps) =>
  factory.createHandlers(postValidation, async (c) => {
    const body = c.req.valid('json');
    const userId = c.get('userId');

    const taskGroupController = new TaskGroupController(deps);
    const res = await taskGroupController.createTaskGroup({
      userId,
      name: body.name,
    });

    return successResponse(
      JSON.stringify({
        id: res,
      }),
    );
  });
