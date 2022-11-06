// TODO: Consider adding another interceptor specifically for refreshing auth cookies
// to avoid the need for SetAuthCookieInterceptor to support both cases

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "../../users/models/user.model";
import { AuthTokens } from "../auth.service";

export interface SetAuthCookieInput {
  authTokens: AuthTokens;
  user?: Omit<User, "password">;
}

@Injectable()
export class SetAuthCookieInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(({ user, authTokens }: SetAuthCookieInput) => {
        const ctx = GqlExecutionContext.create(context).getContext();
        ctx.req.res.cookie("auth", authTokens, {
          httpOnly: true,
          sameSite: true,
          secure: true,
        });
        if (!user) {
          return true;
        }
        return { user };
      })
    );
  }
}
