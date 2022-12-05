// TODO: Update to be used in place of Context decorator

import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { User } from "../../users/models/user.model";

export const CurrentUser = createParamDecorator<
  unknown,
  ExecutionContext,
  User
>((_, context) => {
  const ctx = GqlExecutionContext.create(context);
  const { req } = ctx.getContext();
  return req.user;
});
