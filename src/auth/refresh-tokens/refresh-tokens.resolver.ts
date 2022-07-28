import { UseGuards, UseInterceptors } from "@nestjs/common";
import { Mutation, Resolver } from "@nestjs/graphql";
import { User } from "../../users/models/user.model";
import { CurrentUser } from "../decorators/current-user.decorator";
import { SetAuthCookieInterceptor } from "../interceptors/set-auth-cookie.interceptor";
import { JwtRefreshAuthGuard } from "./guards/jwt-refresh-auth.guard";
import { RefreshToken } from "./models/refresh-token.model";
import { RefreshTokensService } from "./refresh-tokens.service";

@Resolver((_of: RefreshToken) => RefreshToken)
export class RefreshTokensResolver {
  constructor(private refreshTokensService: RefreshTokensService) {}

  @Mutation(() => Boolean)
  @UseGuards(JwtRefreshAuthGuard)
  @UseInterceptors(SetAuthCookieInterceptor)
  async refreshToken(@CurrentUser() user: User) {
    return this.refreshTokensService.refreshToken(user.id);
  }
}
