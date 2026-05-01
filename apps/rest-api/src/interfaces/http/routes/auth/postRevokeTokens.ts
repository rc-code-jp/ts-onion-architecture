import { AuthController } from '@/interfaces/controllers/AuthController';
import { AppDeps } from '@/interfaces/deps';
import { successResponse } from '@/interfaces/http/utils/responses';
import { createFactory } from 'hono/factory';
import { refreshTokenValidation } from '../../validators/auth';

const factory = createFactory<{
  Variables: {
    userId: number;
  };
}>();

/**
 * リフレッシュトークンを無効化する
 */
export const createPostRevokeTokens = (deps: AppDeps) =>
  factory.createHandlers(refreshTokenValidation, async (c) => {
    const userId = c.get('userId');

    const authController = new AuthController(deps);
    const res = await authController.revokeTokens({
      userId: userId,
    });

    return successResponse(
      JSON.stringify({
        res: res,
      }),
    );
  });
