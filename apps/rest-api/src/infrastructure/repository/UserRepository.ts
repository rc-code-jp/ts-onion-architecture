import { IUserRepository } from '@/application/repositories/IUserRepository';
import { UserModel } from '@/domain/models/UserModel';
import { PrismaClient } from '@prisma/client';

export class UserRepository implements IUserRepository {
  constructor(private db: PrismaClient) {}

  async findByEmail(params: { email: string }): Promise<UserModel | null> {
    const item = await this.db.user.findUnique({
      where: { email: params.email },
    });
    if (!item) return null;

    const model = new UserModel({
      id: item.id,
      email: item.email,
      name: item.name,
      hashedPassword: item.hashedPassword,
    });
    return model;
  }

  async findById(params: { id: number }): Promise<UserModel | null> {
    const item = await this.db.user.findUnique({
      where: { id: params.id },
    });
    if (!item) return null;

    const model = new UserModel({
      id: item.id,
      email: item.email,
      name: item.name,
      hashedPassword: item.hashedPassword,
    });
    return model;
  }

  async create(params: {
    email: string;
    hashedPassword: string;
    name: string;
  }): Promise<UserModel> {
    const item = await this.db.user.create({
      data: {
        email: params.email,
        name: params.name,
        hashedPassword: params.hashedPassword,
      },
    });
    return new UserModel({
      id: item.id,
      email: item.email,
      name: item.name,
      hashedPassword: item.hashedPassword,
    });
  }
}
