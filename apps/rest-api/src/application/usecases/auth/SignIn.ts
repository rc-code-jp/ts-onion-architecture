import { IRefreshTokenRepository } from '@/application/repositories/IRefreshTokenRepository';
import { IUserRepository } from '@/application/repositories/IUserRepository';
import { IPasswordHasher } from '@/application/services/IPasswordHasher';
import { ITokenService } from '@/application/services/ITokenService';
import { IUuidGenerator } from '@/application/services/IUuidGenerator';
import { InvalidCredentialError } from '@/domain/errors/InvalidCredentialError';

export class SignIn {
  constructor(
    private repository: IUserRepository,
    private refreshTokenRepository: IRefreshTokenRepository,
    private passwordHasher: IPasswordHasher,
    private tokenService: ITokenService,
    private uuidGenerator: IUuidGenerator,
  ) {}

  async execute(params: { email: string; password: string }) {
    const existsUser = await this.repository.findByEmail({ email: params.email });
    if (!existsUser) {
      throw new InvalidCredentialError('Invalid email or password');
    }

    const validPassword = await this.passwordHasher.compare(
      params.password,
      existsUser.hashedPassword,
    );
    if (!validPassword) {
      throw new InvalidCredentialError('Invalid email or password');
    }

    const uuid = this.uuidGenerator.generate();
    const { accessToken, refreshToken } = this.tokenService.generateTokens(existsUser.id, uuid);
    const hashedToken = this.tokenService.hashRefreshToken(refreshToken);

    await this.refreshTokenRepository.create({
      uuid: uuid,
      hashedToken: hashedToken,
      userId: existsUser.id,
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
