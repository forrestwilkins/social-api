import { allow, and, not, shield } from "graphql-shield";
import { ServerPermissions } from "../../roles/permissions/permissions.constants";
import { UNAUTHORIZED } from "../../shared/shared.constants";
import {
  canDeletePost,
  hasPermission,
  hasValidRefreshToken,
  isAuthenticated,
} from "./shield.rules";

const shieldPermissions = shield(
  {
    Query: {
      "*": isAuthenticated,
      posts: allow,
      users: hasPermission(ServerPermissions.BanMembers),
    },
    Mutation: {
      "*": isAuthenticated,
      login: allow,
      logOut: allow,
      signUp: allow,
      deletePost: canDeletePost,
      refreshToken: and(not(isAuthenticated), hasValidRefreshToken),
    },
    Role: hasPermission(ServerPermissions.ManageRoles),
    RoleMember: hasPermission(ServerPermissions.ManageRoles),
  },
  {
    allowExternalErrors: true,
    fallbackError: UNAUTHORIZED,
  }
);

export default shieldPermissions;
