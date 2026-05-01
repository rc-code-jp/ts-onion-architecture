import { IPasswordHasher } from '@/application/services/IPasswordHasher';
import { ITokenService } from '@/application/services/ITokenService';
import { IUnitOfWork } from '@/application/services/IUnitOfWork';
import { IUuidGenerator } from '@/application/services/IUuidGenerator';
import { AlreadyExistsError } from '@/domain/errors/AlreadyExistsError';

export class CreateUser {
  constructor(
    private unitOfWork: IUnitOfWork,
    private passwordHasher: IPasswordHasher,
    private tokenService: ITokenService,
    private uuidGenerator: IUuidGenerator,
  ) {}

  async execute(params: { email: string; password: string; name: string }) {
    // bcrypt はトランザクション外で実行（DB コネクションを長時間保持しないため）
    const hashedPassword = await this.passwordHasher.hash(params.password);
    const uuid = this.uuidGenerator.generate();

    return this.unitOfWork.transaction(async (repos) => {
      const existsUser = await repos.userRepository.findByEmail({ email: params.email });
      if (existsUser) {
        throw new AlreadyExistsError('Email already exists');
      }

      const user = await repos.userRepository.create({
        name: params.name,
        email: params.email,
        hashedPassword: hashedPassword,
      });

      const { accessToken, refreshToken } = this.tokenService.generateTokens(user.id, uuid);
      const hashedToken = this.tokenService.hashRefreshToken(refreshToken);

      await repos.refreshTokenRepository.create({
        uuid: uuid,
        hashedToken: hashedToken,
        userId: user.id,
      });

      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    });
  }
}
