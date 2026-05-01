import { IRefreshTokenRepository } from '@/application/repositories/IRefreshTokenRepository';
import { IUserRepository } from '@/application/repositories/IUserRepository';
import { ITokenService } from '@/application/services/ITokenService';
import { IUuidGenerator } from '@/application/services/IUuidGenerator';

export class RefreshToken {
  constructor(
    private repository: IUserRepository,
    private refreshTokenRepository: IRefreshTokenRepository,
    private tokenService: ITokenService,
    private uuidGenerator: IUuidGenerator,
  ) {}

  async execute(params: { refreshToken: string }) {
    const payload = this.tokenService.verifyRefreshToken(params.refreshToken);
    const savedRefreshToken = await this.refreshTokenRepository.findByUuid({
      uuid: payload.jti ?? '',
    });

    if (!savedRefreshToken || savedRefreshToken.revoked) {
      throw new Error('Unauthorized');
    }

    const hashedToken = this.tokenService.hashRefreshToken(params.refreshToken);
    if (hashedToken !== savedRefreshToken.hashedToken) {
      throw new Error('Unauthorized');
    }

    const user = await this.repository.findById({
      id: savedRefreshToken.userId,
    });

    if (!user) {
      throw new Error('Unauthorized');
    }

    await this.refreshTokenRepository.delete({
      uuid: savedRefreshToken.uuid,
    });

    const uuid = this.uuidGenerator.generate();
    const { accessToken, refreshToken } = this.tokenService.generateTokens(user.id, uuid);
    const newHashedToken = this.tokenService.hashRefreshToken(refreshToken);

    await this.refreshTokenRepository.create({
      uuid: uuid,
      hashedToken: newHashedToken,
      userId: user.id,
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
