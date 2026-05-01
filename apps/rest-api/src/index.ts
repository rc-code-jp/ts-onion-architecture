import { BcryptPasswordHasher } from '@/infrastructure/auth/BcryptPasswordHasher';
import { JwtTokenService } from '@/infrastructure/auth/JwtTokenService';
import { UuidGenerator } from '@/infrastructure/auth/UuidGenerator';
import { db } from '@/infrastructure/database/db';
import { RefreshTokenRepository } from '@/infrastructure/repository/RefreshTokenRepository';
import { TaskGroupRepository } from '@/infrastructure/repository/TaskGroupRepository';
import { TaskRepository } from '@/infrastructure/repository/TaskRepository';
import { UserRepository } from '@/infrastructure/repository/UserRepository';
import { AppDeps } from '@/interfaces/deps';
import { createApp } from '@/interfaces/http/app';
import { serve } from '@hono/node-server';

const SERVER_PORT = 3000;

const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;
if (!accessSecret) {
  throw new Error('JWT_ACCESS_SECRET is required');
}
if (!refreshSecret) {
  throw new Error('JWT_REFRESH_SECRET is required');
}

const deps: AppDeps = {
  userRepository: new UserRepository(db),
  refreshTokenRepository: new RefreshTokenRepository(db),
  taskRepository: new TaskRepository(db),
  taskGroupRepository: new TaskGroupRepository(db),
  passwordHasher: new BcryptPasswordHasher(),
  tokenService: new JwtTokenService({ accessSecret, refreshSecret }),
  uuidGenerator: new UuidGenerator(),
};

const app = createApp(deps);

serve({
  fetch: app.fetch,
  port: SERVER_PORT,
});

// biome-ignore lint/suspicious/noConsoleLog: <explanation>
console.log(`Server running http://localhost:${SERVER_PORT}/`);
