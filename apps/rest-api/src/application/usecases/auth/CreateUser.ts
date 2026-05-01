import { IRefreshTokenRepository } from '@/application/repositories/IRefreshTokenRepository';
import { IUserRepository } from '@/application/repositories/IUserRepository';
import { IPasswordHasher } from '@/application/services/IPasswordHasher';
import { ITokenService } from '@/application/services/ITokenService';
import { IUuidGenerator } from '@/application/services/IUuidGenerator';

export class CreateUser {
  constructor(
    private repository: IUserRepository,
    private refreshTokenRepository: IRefreshTokenRepository,
    private passwordHasher: IPasswordHasher,
    private tokenService: ITokenService,
    private uuidGenerator: IUuidGenerator,
  ) {}

  async execute(params: { email: string; password: string; name: string }) {
    const existsUser = await this.repository.findByEmail({ email: params.email });

    if (existsUser) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await this.passwordHasher.hash(params.password);

    const user = await this.repository.create({
      name: params.name,
      email: params.email,
      hashedPassword: hashedPassword,
    });

    const uuid = this.uuidGenerator.generate();
    const { accessToken, refreshToken } = this.tokenService.generateTokens(user.id, uuid);
    const hashedToken = this.tokenService.hashRefreshToken(refreshToken);

    await this.refreshTokenRepository.create({
      uuid: uuid,
      hashedToken: hashedToken,
      userId: user.id,
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
