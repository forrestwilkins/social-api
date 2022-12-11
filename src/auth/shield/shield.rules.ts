import { rule } from "graphql-shield";
import { Context } from "../../shared/shared.types";
import { getJti, getSub } from "../auth.utils";

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
