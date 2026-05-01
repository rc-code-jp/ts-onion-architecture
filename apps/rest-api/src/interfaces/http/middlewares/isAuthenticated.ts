import { ITokenService } from '@/application/services/ITokenService';
import { unauthorizedResponse } from '@/interfaces/http/utils/responses';
import { createFactory } from 'hono/factory';

const factory = createFactory<{
  Variables: {
    userId: number;
  };
}>();

export const createIsAuthenticated = (tokenService: ITokenService) =>
  factory.createMiddleware(async (c, next) => {
    const { authorization } = c.req.header();
    if (!authorization) {
      return unauthorizedResponse('Unauthorized');
    }

    try {
      const token = authorization.split(' ')[1];
      const payload = tokenService.verifyAccessToken(token);
      c.set('userId', payload.userId);
      await next();
    } catch (_e) {
      return unauthorizedResponse('Unauthorized');
    }
  });
