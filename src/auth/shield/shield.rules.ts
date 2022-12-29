import { rule } from "graphql-shield";
import { ServerPermissions } from "../../roles/permissions/permissions.constants";
import { UNAUTHORIZED } from "../../shared/shared.constants";
import { Context } from "../../shared/shared.types";
import { generateRandom } from "../../shared/shared.utils";
import { getJti, getSub } from "../auth.utils";

export const canDeletePost = rule()(
  async (_parent, args, { user, permissions, usersService }: Context) => {
    if (!user) {
      return UNAUTHORIZED;
    }

    const hasPermission = permissions?.serverPermissions.has(
      ServerPermissions.ManagePosts
    );
    const isOwnPost = await usersService.isUsersPost(user.id, args.id);

    if (!hasPermission && !isOwnPost) {
      return false;
    }

    return true;
  }
);

export const hasPermission = (permissionName: string, groupId?: number) => {
  const uniqueToken = generateRandom();
  const group = groupId ? `group-${groupId}-` : "";
  const ruleName = `hasPermission-${group}${permissionName}-${uniqueToken}`;

  return rule(ruleName)(async (_parent, _args, { permissions }: Context) => {
    // TODO: Add logic for checking group permissions
    if (!permissions || groupId) {
      return false;
    }
    if (!permissions.serverPermissions.has(permissionName)) {
      return false;
    }
    return true;
  });
};

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
