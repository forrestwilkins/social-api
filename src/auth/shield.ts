import { allow, and, not, rule, shield } from "graphql-shield";
import { UNAUTHORIZED } from "../shared/shared.constants";
import { Context } from "../shared/shared.types";

const isAuthenticated = rule({ cache: "contextual" })(
  async (_parent, _args, { claims: { accessTokenClaims } }: Context) =>
    !!accessTokenClaims
);

const hasValidRefreshToken = rule()(
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

const shieldPermissions = shield(
  {
    Query: {
      authCheck: isAuthenticated,
      me: isAuthenticated,
      users: isAuthenticated,
    },
    Mutation: {
      "*": isAuthenticated,
      login: allow,
      logOut: allow,
      signUp: allow,
      refreshToken: and(not(isAuthenticated), hasValidRefreshToken),
    },
    MemberRequest: isAuthenticated,
  },
  {
    fallbackError: UNAUTHORIZED,
  }
);

export default shieldPermissions;
