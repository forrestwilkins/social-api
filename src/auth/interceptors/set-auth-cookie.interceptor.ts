import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AuthCookiePayload } from "../auth.service";

@Injectable()
export class SetAuthCookieInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: AuthCookiePayload) => {
        const ctx = GqlExecutionContext.create(context).getContext();
        ctx.req.res.cookie("auth", data, {
          httpOnly: true,
          sameSite: true,
          secure: true,
        });
        return true;
      })
    );
  }
}
