import { allow, and, not, shield } from "graphql-shield";
import { FORBIDDEN } from "../../shared/shared.constants";
import { hasValidRefreshToken, isAuthenticated } from "./shield.rules";

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
    fallbackError: FORBIDDEN,
  }
);

export default shieldPermissions;
