import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthenticationError } from "apollo-server-express";
import { Context } from "../../../shared/shared.types";
import { getSub } from "../../auth.utils";

export const RefreshTokenUser = createParamDecorator<unknown, ExecutionContext>(
  (_, context) => {
    const executionContext = GqlExecutionContext.create(context);
    const {
      claims: { refreshTokenClaims },
      usersService,
    }: Context = executionContext.getContext();

    const sub = getSub(refreshTokenClaims);
    if (!sub) {
      throw new AuthenticationError("Refresh token malformed");
    }

    return usersService.getUser({ id: sub });
  }
);
