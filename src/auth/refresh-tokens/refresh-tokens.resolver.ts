/**
 * TODO: Decide whether RefreshTokensResolver should also use
 * GraphQL Shield instead of NestJS auth guards
 */

import { UseInterceptors } from "@nestjs/common";
import { Context, Mutation, Resolver } from "@nestjs/graphql";
import { User } from "../../users/models/user.model";
import { RefreshAuthCookieInterceptor } from "./interceptors/refresh-auth-cookie.interceptor";
import { RefreshToken } from "./models/refresh-token.model";
import { RefreshTokensService } from "./refresh-tokens.service";

@Resolver(() => RefreshToken)
export class RefreshTokensResolver {
  constructor(private refreshTokensService: RefreshTokensService) {}

  @Mutation(() => Boolean)
  @UseInterceptors(RefreshAuthCookieInterceptor)
  async refreshToken(@Context() { user }: { user: User }) {
    return this.refreshTokensService.refreshToken(user.id);
  }
}
