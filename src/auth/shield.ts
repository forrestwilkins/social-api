// TODO: Add remaining permissions and logic for checking auth state

import { Context } from "apollo-server-core";
import { rule, shield } from "graphql-shield";
import { UNAUTHORIZED } from "../shared/shared.constants";
import { UserPermissions } from "../users/users.service";

interface ContextWithPermissions extends Context {
  permissions?: UserPermissions;
}

const isAuthenticated = rule()(
  async (_, __, ctx: ContextWithPermissions) => !!ctx.permissions
);

const shieldPermissions = shield(
  {
    Query: {
      users: isAuthenticated,
    },
  },
  {
    fallbackError: UNAUTHORIZED,
  }
);

export default shieldPermissions;
