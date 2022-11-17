import { UseGuards, UseInterceptors } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { GqlAuthGuard } from "./guards/gql-auth.guard";
import { ClearAuthCookieInterceptor } from "./interceptors/clear-auth-cookie.interceptor";
import { SetAuthCookieInterceptor } from "./interceptors/set-auth-cookie.interceptor";
import { LoginInput } from "./models/login.input";
import { AuthPayload } from "./models/auth.payload";
import { SignUpInput } from "./models/sign-up.input";

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthPayload)
  @UseInterceptors(SetAuthCookieInterceptor)
  async login(@Args("input") input: LoginInput) {
    return this.authService.login(input);
  }

  @Mutation(() => AuthPayload)
  @UseInterceptors(SetAuthCookieInterceptor)
  async signUp(@Args("input") input: SignUpInput) {
    return this.authService.signUp(input);
  }

  @Mutation(() => Boolean)
  @UseInterceptors(ClearAuthCookieInterceptor)
  async logOut() {
    return true;
  }

  @Query(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async authCheck() {
    return true;
  }
}
