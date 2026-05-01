import { CreateUser } from '@/application/usecases/auth/CreateUser';
import { GetAuthMe } from '@/application/usecases/auth/GetAuthMe';
import { RefreshToken } from '@/application/usecases/auth/RefreshToken';
import { RevokeTokens } from '@/application/usecases/auth/RevokeTokens';
import { SignIn } from '@/application/usecases/auth/SignIn';
import { AppDeps } from '@/interfaces/deps';

export class AuthController {
  constructor(private deps: AppDeps) {}

  async signUp(params: {
    email: string;
    password: string;
    name: string;
  }) {
    const usecase = new CreateUser(
      this.deps.unitOfWork,
      this.deps.passwordHasher,
      this.deps.tokenService,
      this.deps.uuidGenerator,
    );
    const res = await usecase.execute({
      email: params.email,
      password: params.password,
      name: params.name,
    });

    return {
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
    };
  }

  async signIn(params: {
    email: string;
    password: string;
  }) {
    const usecase = new SignIn(
      this.deps.userRepository,
      this.deps.refreshTokenRepository,
      this.deps.passwordHasher,
      this.deps.tokenService,
      this.deps.uuidGenerator,
    );
    const res = await usecase.execute({
      email: params.email,
      password: params.password,
    });

    return {
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
    };
  }

  async refreshToken(params: {
    refreshToken: string;
  }) {
    const usecase = new RefreshToken(
      this.deps.userRepository,
      this.deps.refreshTokenRepository,
      this.deps.tokenService,
      this.deps.uuidGenerator,
    );
    const res = await usecase.execute({
      refreshToken: params.refreshToken,
    });

    return {
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
    };
  }

  async revokeTokens(params: {
    userId: number;
  }) {
    const usecase = new RevokeTokens(this.deps.refreshTokenRepository);
    const res = await usecase.execute({
      userId: params.userId,
    });

    return {
      count: res.count,
    };
  }

  async getAuthMe(params: {
    userId: number;
  }) {
    const usecase = new GetAuthMe(this.deps.userRepository);
    const res = await usecase.execute({
      userId: params.userId,
    });

    return {
      item: res.user,
    };
  }
}
