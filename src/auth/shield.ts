// TODO: Add remaining permissions and logic for checking auth state

import { rule, shield } from "graphql-shield";
import { Context } from "../shared/shared.types";
import { UNAUTHORIZED } from "../shared/shared.constants";

const isAuthenticated = rule()(
  async (_, __, ctx: Context) => !!ctx.permissions
);

const hasPermission = rule()(async (_, __, ctx: Context) => {
  // TODO: Remove when no longer needed for testing
  console.log(ctx.permissions);
  console.log(ctx.user);

  return true;
});

const shieldPermissions = shield(
  {
    Query: {
      me: isAuthenticated,
      posts: hasPermission,
      users: isAuthenticated,
    },
  },
  {
    fallbackError: UNAUTHORIZED,
  }
);

export default shieldPermissions;
