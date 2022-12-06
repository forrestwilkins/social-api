import { allow, and, not, shield } from "graphql-shield";
import { UNAUTHORIZED } from "../../shared/shared.constants";
import { hasValidRefreshToken, isAuthenticated } from "./rules";

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
