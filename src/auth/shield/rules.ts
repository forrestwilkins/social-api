import { rule } from "graphql-shield";
import { Context } from "../../shared/shared.types";

// TODO: Ensure that user can be found from sub claim on access token
export const isAuthenticated = rule({ cache: "contextual" })(
  async (_parent, _args, { claims: { accessTokenClaims } }: Context) =>
    !!accessTokenClaims
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
    return !!refreshTokensService.validateRefreshToken(jti, sub);
  }
);
