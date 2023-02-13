import { allow, and, not, or, shield } from "graphql-shield";
import { FORBIDDEN } from "../../common/common.constants";
import {
  canBanMembers,
  canManagePosts,
  canManageRoles,
  hasValidRefreshToken,
  isAuthenticated,
  isOwnPost,
} from "./shield.rules";

const shieldPermissions = shield(
  {
    Query: {
      "*": isAuthenticated,
      users: canBanMembers,

      // TODO: Remove once no longer needed for testing
      serverInvites: allow,
    },
    Mutation: {
      "*": isAuthenticated,
      login: allow,
      logOut: allow,
      signUp: allow,
      deletePost: or(canManagePosts, isOwnPost),
      refreshToken: and(not(isAuthenticated), hasValidRefreshToken),
    },
    Role: canManageRoles,
    RoleMember: canManageRoles,
  },
  {
    allowExternalErrors: true,
    fallbackError: FORBIDDEN,
  }
);

export default shieldPermissions;
