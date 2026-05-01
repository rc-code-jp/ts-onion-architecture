import { AuthController } from '@/interfaces/controllers/AuthController';
import { AppDeps } from '@/interfaces/deps';
import { successResponse } from '@/interfaces/http/utils/responses';
import { createFactory } from 'hono/factory';
import { postSignUpValidation } from '../../validators/auth';

const factory = createFactory();

/**
 * サインアップ
 */
export const createPostSignUp = (deps: AppDeps) =>
  factory.createHandlers(postSignUpValidation, async (c) => {
    const body = c.req.valid('json');

    const authController = new AuthController(deps);
    const res = await authController.signUp({
      email: body.email,
      password: body.password,
      name: body.name,
    });

    return successResponse(
      JSON.stringify({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
      }),
    );
  });
