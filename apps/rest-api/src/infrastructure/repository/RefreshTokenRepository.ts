import { IRefreshTokenRepository } from '@/application/repositories/IRefreshTokenRepository';
import { RefreshTokenModel } from '@/domain/models/RefreshTokenModel';
import { PrismaClient } from '@prisma/client';

export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private db: PrismaClient) {}

  async create(params: {
    uuid: string;
    hashedToken: string;
    userId: number;
  }): Promise<RefreshTokenModel> {
    const item = await this.db.refreshToken.create({
      data: {
        uuid: params.uuid,
        hashedToken: params.hashedToken,
        userId: params.userId,
      },
    });
    return new RefreshTokenModel({
      id: item.id,
      uuid: item.uuid,
      hashedToken: item.hashedToken,
      userId: item.userId,
      revoked: item.revoked,
    });
  }

  async findByUuid(params: { uuid: string }): Promise<RefreshTokenModel | null> {
    const item = await this.db.refreshToken.findFirst({
      where: { uuid: params.uuid },
    });
    if (!item) return null;

    const model = new RefreshTokenModel({
      id: item.id,
      uuid: item.uuid,
      hashedToken: item.hashedToken,
      userId: item.userId,
      revoked: item.revoked,
    });
    return model;
  }

  async delete(params: { uuid: string }): Promise<RefreshTokenModel | null> {
    const item = await this.db.refreshToken.update({
      where: { uuid: params.uuid },
      data: {
        revoked: true,
      },
    });
    if (!item) return null;

    const model = new RefreshTokenModel({
      id: item.id,
      uuid: item.uuid,
      hashedToken: item.hashedToken,
      userId: item.userId,
      revoked: item.revoked,
    });
    return model;
  }

  async revokeMany(params: { userId: number }): Promise<number> {
    const res = await this.db.refreshToken.updateMany({
      where: { userId: params.userId },
      data: {
        revoked: true,
      },
    });
    return res.count;
  }
}
