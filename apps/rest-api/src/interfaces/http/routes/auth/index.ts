import { AppDeps } from '@/interfaces/deps';
import { Hono } from 'hono';
import { createGetAuthMe } from './getAuthMe';
import { createPostRefreshToken } from './postRefreshToken';
import { createPostSignIn } from './postSignIn';
import { createPostSignUp } from './postSignUp';

export const createAuthRoute = (deps: AppDeps) => {
  const app = new Hono();

  app.post('/signup', ...createPostSignUp(deps));
  app.post('/signin', ...createPostSignIn(deps));
  app.post('/refresh-token', ...createPostRefreshToken(deps));

  app.get('/me', ...createGetAuthMe(deps));

  return app;
};
