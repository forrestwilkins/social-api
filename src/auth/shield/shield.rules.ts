import { rule } from "graphql-shield";
import { UNAUTHORIZED } from "../../shared/shared.constants";
import { Context } from "../../shared/shared.types";

export const isAuthenticated = rule({ cache: "contextual" })(
  async (_parent, _args, { claims: { accessTokenClaims }, user }: Context) => {
    if (!accessTokenClaims?.sub || !user) {
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
    if (!refreshTokenClaims?.jti || !refreshTokenClaims.sub) {
      return false;
    }
    const jti = parseInt(refreshTokenClaims.jti);
    const sub = parseInt(refreshTokenClaims.sub);
    return refreshTokensService.validateRefreshToken(jti, sub);
  }
);
