import { TaskGroupController } from '@/interfaces/controllers/TaskGroupController';
import { AppDeps } from '@/interfaces/deps';
import { notFoundResponse, successResponse } from '@/interfaces/http/utils/responses';
import { patchSortValidation } from '@/interfaces/http/validators/taskGroups';
import { createFactory } from 'hono/factory';

const factory = createFactory<{
  Variables: {
    userId: number;
  };
}>();

/**
 * タスクグループの並び順を更新
 */
export const createPatchTaskGroupSort = (deps: AppDeps) =>
  factory.createHandlers(patchSortValidation, async (c) => {
    const { taskGroupId } = c.req.param();
    const body = c.req.valid('json');
    const userId = c.get('userId');

    const taskGroupController = new TaskGroupController(deps);
    const res = await taskGroupController.updateTaskGroupSort({
      id: Number(taskGroupId),
      userId: userId,
      prevId: body.prevId,
      nextId: body.nextId,
    });

    if (!res) return notFoundResponse();

    return successResponse(
      JSON.stringify({
        id: res,
      }),
    );
  });
