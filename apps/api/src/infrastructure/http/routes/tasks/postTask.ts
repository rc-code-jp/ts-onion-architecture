import { jsonResponse } from '@/infrastructure/http/responses';
import { postValidation } from '@/infrastructure/http/validators/tasks';
import { TaskController } from '@/interfaces/controllers/TaskController';
import { createFactory } from 'hono/factory';

const factory = createFactory();

/**
 * タスク作成
 */
const handlers = factory.createHandlers(postValidation, async (c) => {
  const body = c.req.valid('json');
  const userId = c.get('userId');

  const taskController = new TaskController();
  const res = await taskController.createTask({
    userId: userId,
    taskGroupId: body.taskGroupId,
    title: body.title,
    description: body.description,
    dueDate: body.dueDate,
    dueTime: body.dueTime,
  });

  return jsonResponse(
    JSON.stringify({
      id: res,
    }),
  );
});

export const postTask = handlers;
