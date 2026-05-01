import { AuthController } from '@/interfaces/controllers/AuthController';
import { AppDeps } from '@/interfaces/deps';
import { successResponse } from '@/interfaces/http/utils/responses';
import { createFactory } from 'hono/factory';
import { createIsAuthenticated } from '../../middlewares/isAuthenticated';

const factory = createFactory<{
  Variables: {
    userId: number;
  };
}>();

/**
 * 認証中ユーザー情報取得
 */
export const createGetAuthMe = (deps: AppDeps) =>
  factory.createHandlers(createIsAuthenticated(deps.tokenService), async (c) => {
    const userId = c.get('userId');

    const authController = new AuthController(deps);
    const res = await authController.getAuthMe({
      userId: userId,
    });

    return successResponse(
      JSON.stringify({
        user: res.item,
      }),
    );
  });
