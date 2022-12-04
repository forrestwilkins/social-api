// TODO: Add remaining permissions and logic for checking auth state

import { rule, shield } from "graphql-shield";

const hasPermission = rule()(async (_parent, _args, ctx) => {
  // TODO: Remove when no longer needed for testing
  console.log(ctx.permissions);

  return true;
});

const permissions = shield(
  {
    Query: {
      posts: hasPermission,
    },
  },
  {
    fallbackError: "Unauthorized",
  }
);

export default permissions;
