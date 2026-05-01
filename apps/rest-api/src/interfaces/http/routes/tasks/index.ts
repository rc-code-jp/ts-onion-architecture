import { AppDeps } from '@/interfaces/deps';
import { Hono } from 'hono';
import { createIsAuthenticated } from '../../middlewares/isAuthenticated';
import { createDeleteDoneTasks } from './deleteDoneTasks';
import { createDeleteTask } from './deleteTask';
import { createPatchTask } from './patchTask';
import { createPatchTaskDone } from './patchTaskDone';
import { createPatchTaskSort } from './patchTaskSort';
import { createPostTask } from './postTask';

export const createTasksRoute = (deps: AppDeps) => {
  const app = new Hono<{
    Variables: {
      userId: number;
    };
  }>();

  app.use('*', createIsAuthenticated(deps.tokenService));

  app.post('/', ...createPostTask(deps));
  app.patch('/:taskId', ...createPatchTask(deps));
  app.patch('/:taskId/done', ...createPatchTaskDone(deps));
  app.patch('/:taskId/sort', ...createPatchTaskSort(deps));
  app.delete('/:taskId', ...createDeleteTask(deps));
  app.delete('/done-tasks', ...createDeleteDoneTasks(deps));

  return app;
};
