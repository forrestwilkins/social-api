import { allow, and, not, shield } from "graphql-shield";
import { UNAUTHORIZED } from "../../shared/shared.constants";
import { hasValidRefreshToken, isAuthenticated } from "./shield.rules";

const shieldPermissions = shield(
  {
    Query: {
      "*": isAuthenticated,
      posts: allow,
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
    allowExternalErrors: true,
    fallbackError: UNAUTHORIZED,
  }
);

export default shieldPermissions;
