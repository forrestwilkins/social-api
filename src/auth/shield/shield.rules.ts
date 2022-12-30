import { rule } from "graphql-shield";
import { ServerPermissions } from "../../roles/permissions/permissions.constants";
import { UNAUTHORIZED } from "../../shared/shared.constants";
import { Context } from "../../shared/shared.types";
import { getJti, getSub } from "../auth.utils";
import { hasPermission } from "./shield.utils";

export const canManagePosts = rule()(
  async (_parent, _args, { permissions }: Context) =>
    hasPermission(permissions, ServerPermissions.ManagePosts)
);

export const canManageRoles = rule()(
  async (_parent, _args, { permissions }: Context) =>
    hasPermission(permissions, ServerPermissions.ManageRoles)
);

export const canBanMembers = rule()(
  async (_parent, _args, { permissions }: Context) =>
    hasPermission(permissions, ServerPermissions.BanMembers)
);

export const isOwnPost = rule()(
  async (_parent, args, { user, usersService }: Context) =>
    usersService.isUsersPost(args.id, user?.id)
);

export const isAuthenticated = rule({ cache: "contextual" })(
  async (_parent, _args, { user }: Context) => {
    if (!user) {
      return UNAUTHORIZED;
    }
    return true;
  }
);

export const hasValidRefreshToken = rule()(
  async (
    _parent,
    _args,
    { claims: { refreshTokenClaims }, refreshTokensService }: Context
  ) => {
    const jti = getJti(refreshTokenClaims);
    const sub = getSub(refreshTokenClaims);
    if (!jti || !sub) {
      return UNAUTHORIZED;
    }
    return refreshTokensService.validateRefreshToken(jti, sub);
  }
);
