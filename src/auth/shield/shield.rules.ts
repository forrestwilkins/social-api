import { rule } from "graphql-shield";
import { ServerPermissions } from "../../roles/permissions/permissions.constants";
import { UNAUTHORIZED } from "../../shared/shared.constants";
import { Context } from "../../shared/shared.types";
import { getJti, getSub } from "../auth.utils";

export const isOwnPost = rule()(
  async (_parent, args, { user, usersService }: Context) => {
    const isOwnPost = user
      ? await usersService.isUsersPost(user.id, args.id)
      : false;

    if (isOwnPost) {
      return false;
    }

    return true;
  }
);

export const canManagePosts = rule()(
  async (_parent, _args, { permissions }: Context) => {
    const hasPermission = permissions?.serverPermissions.has(
      ServerPermissions.ManagePosts
    );
    if (!hasPermission) {
      return false;
    }
    return true;
  }
);

export const canManageRoles = rule()(
  async (_parent, _args, { permissions }: Context) => {
    const hasPermission = permissions?.serverPermissions.has(
      ServerPermissions.ManageRoles
    );
    if (!hasPermission) {
      return false;
    }
    return true;
  }
);

export const canBanMembers = rule()(
  async (_parent, _args, { permissions }: Context) => {
    const hasPermission = permissions?.serverPermissions.has(
      ServerPermissions.BanMembers
    );
    if (!hasPermission) {
      return false;
    }
    return true;
  }
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
