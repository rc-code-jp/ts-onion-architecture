import * as crypto from 'node:crypto';
import {
  AccessTokenPayload,
  IssuedTokens,
  ITokenService,
  RefreshTokenPayload,
} from '@/application/services/ITokenService';
import * as jwt from 'jsonwebtoken';

export interface JwtTokenServiceConfig {
  accessSecret: string;
  refreshSecret: string;
  accessExpiresIn?: string;
  refreshExpiresIn?: string;
}

export class JwtTokenService implements ITokenService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpiresIn: string;
  private readonly refreshExpiresIn: string;

  constructor(config: JwtTokenServiceConfig) {
    if (!config.accessSecret) {
      throw new Error('JwtTokenService: accessSecret is required');
    }
    if (!config.refreshSecret) {
      throw new Error('JwtTokenService: refreshSecret is required');
    }
    this.accessSecret = config.accessSecret;
    this.refreshSecret = config.refreshSecret;
    this.accessExpiresIn = config.accessExpiresIn ?? '10m';
    this.refreshExpiresIn = config.refreshExpiresIn ?? '24h';
  }

  generateTokens(userId: number, jti: string): IssuedTokens {
    const accessToken = jwt.sign({ userId }, this.accessSecret, {
      expiresIn: this.accessExpiresIn,
    });
    const refreshToken = jwt.sign({ userId, jti }, this.refreshSecret, {
      expiresIn: this.refreshExpiresIn,
    });
    return { accessToken, refreshToken };
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    return jwt.verify(token, this.accessSecret) as AccessTokenPayload;
  }

  verifyRefreshToken(token: string): RefreshTokenPayload {
    return jwt.verify(token, this.refreshSecret) as RefreshTokenPayload;
  }

  hashRefreshToken(token: string): string {
    return crypto.createHash('sha512').update(token).digest('hex');
  }
}
