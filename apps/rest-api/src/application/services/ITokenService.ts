export interface AccessTokenPayload {
  userId: number;
}

export interface RefreshTokenPayload {
  userId: number;
  jti: string;
}

export interface IssuedTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ITokenService {
  generateTokens(userId: number, jti: string): IssuedTokens;
  verifyAccessToken(token: string): AccessTokenPayload;
  verifyRefreshToken(token: string): RefreshTokenPayload;
  hashRefreshToken(token: string): string;
}
