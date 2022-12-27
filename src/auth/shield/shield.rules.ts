import { rule } from "graphql-shield";
import { FORBIDDEN } from "../../shared/shared.constants";
import { Context } from "../../shared/shared.types";
import { generateRandom } from "../../shared/shared.utils";
import { getJti, getSub } from "../auth.utils";

export const hasPermission = (name: string, groupId?: number) => {
  const token = generateRandom();
  const group = groupId ? `group-${groupId}-` : "";
  const uniqueRuleName = `hasPermission-${group}${name}-${token}`;

  return rule(uniqueRuleName)(
    async (_parent, _args, { permissions }: Context) => {
      if (!permissions) {
        return FORBIDDEN;
      }
      const { serverPermissions, groupPermissions } = permissions;

      if (groupId) {
        console.log(
          "TODO: Add logic for checking group permissions here",
          groupPermissions
        );
        return FORBIDDEN;
      }
      if (!serverPermissions.has(name)) {
        return FORBIDDEN;
      }

      return true;
    }
  );
};

export const isAuthenticated = rule({ cache: "contextual" })(
  async (_parent, _args, { user }: Context) => {
    if (!user) {
      return false;
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
      return false;
    }
    return refreshTokensService.validateRefreshToken(jti, sub);
  }
);
