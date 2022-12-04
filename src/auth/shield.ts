// TODO: Add remaining permissions and logic for checking auth state

import { allow, rule, shield } from "graphql-shield";
import { Context } from "../shared/shared.types";
import { UNAUTHORIZED } from "../shared/shared.constants";

const isAuthenticated = rule({ cache: "contextual" })(
  async (_, __, ctx: Context) => !!ctx.permissions
);

const hasPermission = rule({ cache: "contextual" })(
  async (_, __, ctx: Context) => {
    // TODO: Remove when no longer needed for testing
    console.log(ctx.permissions);
    console.log(ctx.user);

    return true;
  }
);

const shieldPermissions = shield(
  {
    Query: {
      authCheck: isAuthenticated,
      me: isAuthenticated,
      posts: hasPermission,
      users: isAuthenticated,
    },
    Mutation: {
      "*": isAuthenticated,
      login: allow,
      logOut: allow,
      refreshToken: allow,
      signUp: allow,
    },
  },
  {
    fallbackError: UNAUTHORIZED,
  }
);

export default shieldPermissions;
