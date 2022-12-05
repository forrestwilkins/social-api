// TODO: Add remaining permissions and logic for checking auth state

import { allow, rule, shield } from "graphql-shield";
import { UNAUTHORIZED } from "../shared/shared.constants";
import { Context } from "../shared/shared.types";

const isAuthenticated = rule({ cache: "contextual" })(
  async (_, __, ctx: Context) => !!ctx.permissions
);

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
      refreshToken: allow,
      signUp: allow,
    },
    MemberRequest: isAuthenticated,
  },
  {
    fallbackError: UNAUTHORIZED,
  }
);

export default shieldPermissions;
