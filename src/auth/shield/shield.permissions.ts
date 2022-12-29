import { allow, and, not, or, shield } from "graphql-shield";
import { ServerPermissions } from "../../roles/permissions/permissions.constants";
import { FORBIDDEN } from "../../shared/shared.constants";
import {
  canManagePosts,
  hasPermission,
  hasValidRefreshToken,
  isAuthenticated,
  isOwnPost,
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
      deletePost: or(canManagePosts, isOwnPost),
      refreshToken: and(not(isAuthenticated), hasValidRefreshToken),
    },
    Role: hasPermission(ServerPermissions.ManageRoles),
    RoleMember: hasPermission(ServerPermissions.ManageRoles),
  },
  {
    allowExternalErrors: true,
    fallbackError: FORBIDDEN,
  }
);

export default shieldPermissions;
