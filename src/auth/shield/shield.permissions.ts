import { allow, and, not, shield } from "graphql-shield";
import { ServerPermissions } from "../../roles/permissions/permissions.constants";
import { UNAUTHORIZED } from "../../shared/shared.constants";
import {
  hasPermission,
  hasValidRefreshToken,
  isAuthenticated,
} from "./shield.rules";

const shieldPermissions = shield(
  {
    Query: {
      "*": isAuthenticated,
      posts: allow,
      users: hasPermission(ServerPermissions.ManageUsers),
    },
    Mutation: {
      "*": isAuthenticated,
      login: allow,
      logOut: allow,
      signUp: allow,
      refreshToken: and(not(isAuthenticated), hasValidRefreshToken),
    },
  },
  {
    allowExternalErrors: true,
    fallbackError: UNAUTHORIZED,
  }
);

export default shieldPermissions;
