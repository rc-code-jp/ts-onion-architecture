import { AuthController } from '@/interfaces/controllers/AuthController';
import { AppDeps } from '@/interfaces/deps';
import { successResponse } from '@/interfaces/http/utils/responses';
import { createFactory } from 'hono/factory';
import { postSignInValidation } from '../../validators/auth';

const factory = createFactory();

/**
 * サインイン
 */
export const createPostSignIn = (deps: AppDeps) =>
  factory.createHandlers(postSignInValidation, async (c) => {
    const body = c.req.valid('json');

    const authController = new AuthController(deps);
    const res = await authController.signIn({
      email: body.email,
      password: body.password,
    });

    return successResponse(
      JSON.stringify({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
      }),
    );
  });
