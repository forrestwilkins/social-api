import { allow, and, not, or, shield } from "graphql-shield";
import { FORBIDDEN } from "../../shared/shared.constants";
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
      posts: allow,
      users: canBanMembers,
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
