import { AlreadyExistsError } from '@/domain/errors/AlreadyExistsError';
import { InvalidCredentialError } from '@/domain/errors/InvalidCredentialError';
import { NotFoundError } from '@/domain/errors/NotFoundError';
import { UnauthorizedError } from '@/domain/errors/UnauthorizedError';
import { AppDeps } from '@/interfaces/deps';
import { createAuthRoute } from '@/interfaces/http/routes/auth';
import { createTaskGroupsRoute } from '@/interfaces/http/routes/taskGroups';
import { createTasksRoute } from '@/interfaces/http/routes/tasks';
import {
  conflictResponse,
  errorResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
} from '@/interfaces/http/utils/responses';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

export const createApp = (deps: AppDeps) => {
  const app = new Hono<{
    Variables: {
      userId: number;
    };
  }>();

  // ログ
  app.use('*', logger());

  // CORS
  app.use(
    '*',
    cors({
      origin: ['http://localhost:4000'],
    }),
  );

  // ルート
  app.get('/hc', (_c) => successResponse(''));

  app.route('/auth', createAuthRoute(deps));
  app.route('/task-groups', createTaskGroupsRoute(deps));
  app.route('/tasks', createTasksRoute(deps));

  // エラーハンドリング
  app.onError((err, _c) => {
    if (err instanceof NotFoundError) {
      return notFoundResponse(err.message);
    }
    if (err instanceof UnauthorizedError || err instanceof InvalidCredentialError) {
      return unauthorizedResponse(err.message);
    }
    if (err instanceof AlreadyExistsError) {
      return conflictResponse(err.message);
    }
    console.error(err);
    return errorResponse();
  });

  return app;
};
