import { successResponse } from '@/infrastructure/http/utils/responses';
import { AuthController } from '@/interfaces/controllers/AuthController';
import { createFactory } from 'hono/factory';
import { isAuthenticated } from '../../middlewares/isAuthenticated';

const factory = createFactory();

/**
 * サインアップ
 */
export const getAuthMe = factory.createHandlers(isAuthenticated, async (c) => {
  const userId = c.get('userId');

  const authController = new AuthController();
  const res = await authController.getMe({
    userId: userId,
  });

  return successResponse(
    JSON.stringify({
      item: res,
    }),
  );
});
