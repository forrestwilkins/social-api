import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-jwt";
import { RefreshTokensService } from "../refresh-tokens.service";

export interface RefreshTokenPayload {
  /**
   * Identifies the user or subject of the JWT
   * https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.2
   */
  sub: number;
  /**
   * Provides a unique identifier for the JWT
   * https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.7
   */
  jti: number;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  "jwtRefresh"
) {
  constructor(private refreshTokensService: RefreshTokensService) {
    super({
      jwtFromRequest: JwtRefreshStrategy.extractJWT,
      secretOrKey: process.env.JWT_KEY,
      ignoreExpiration: false,
    });
  }

  async validate({ sub, jti }: RefreshTokenPayload) {
    return this.refreshTokensService.validateRefreshToken(sub, jti);
  }

  private static extractJWT(req: Request): string | null {
    if (req.cookies && "auth" in req.cookies) {
      return req.cookies.auth.refresh_token;
    }
    return null;
  }
}
