import { AppDeps } from '@/interfaces/deps';
import { Hono } from 'hono';
import { createIsAuthenticated } from '../../middlewares/isAuthenticated';
import { createDeleteTaskGroup } from './deleteTaskGroup';
import { createGetTaskGroup } from './getTaskGroup';
import { createGetTaskGroupList } from './getTaskGroupList';
import { createPatchTaskGroup } from './patchTaskGroup';
import { createPatchTaskGroupSort } from './patchTaskGroupSort';
import { createPostTaskGroup } from './postTaskGroup';

export const createTaskGroupsRoute = (deps: AppDeps) => {
  const app = new Hono<{
    Variables: {
      userId: number;
    };
  }>();

  app.use('*', createIsAuthenticated(deps.tokenService));

  app.get('/', ...createGetTaskGroupList(deps));
  app.get('/:taskGroupId', ...createGetTaskGroup(deps));
  app.post('/', ...createPostTaskGroup(deps));
  app.patch('/:taskGroupId', ...createPatchTaskGroup(deps));
  app.patch('/:taskGroupId/sort', ...createPatchTaskGroupSort(deps));
  app.delete('/:taskGroupId', ...createDeleteTaskGroup(deps));

  return app;
};
