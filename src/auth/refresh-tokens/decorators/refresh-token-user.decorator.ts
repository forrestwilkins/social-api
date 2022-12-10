import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Context } from "../../../shared/shared.types";
import { User } from "../../../users/models/user.model";
import { getSub } from "../../auth.utils";

export const RefreshTokenUser = createParamDecorator<
  unknown,
  ExecutionContext,
  Promise<User | null>
>(async (_, context) => {
  const executionContext = GqlExecutionContext.create(context);

  const {
    claims: { refreshTokenClaims },
    usersService,
  }: Context = executionContext.getContext();

  const sub = getSub(refreshTokenClaims);
  if (!sub) {
    return null;
  }

  return usersService.getUser({ id: sub });
});
