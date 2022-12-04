/**
 * TODO: Decide whether RefreshTokensResolver should also use
 * GraphQL Shield instead of NestJS auth guards
 */

import { UseGuards, UseInterceptors } from "@nestjs/common";
import { Mutation, Resolver } from "@nestjs/graphql";
import { User } from "../../users/models/user.model";
import { CurrentUser } from "../decorators/current-user.decorator";
import { JwtRefreshAuthGuard } from "./guards/jwt-refresh-auth.guard";
import { RefreshAuthCookieInterceptor } from "./interceptors/refresh-auth-cookie.interceptor";
import { RefreshToken } from "./models/refresh-token.model";
import { RefreshTokensService } from "./refresh-tokens.service";

@Resolver(() => RefreshToken)
export class RefreshTokensResolver {
  constructor(private refreshTokensService: RefreshTokensService) {}

  @Mutation(() => Boolean)
  @UseGuards(JwtRefreshAuthGuard)
  @UseInterceptors(RefreshAuthCookieInterceptor)
  async refreshToken(@CurrentUser() user: User) {
    return this.refreshTokensService.refreshToken(user.id);
  }
}
