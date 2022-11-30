// TODO: Add remaining permissions and logic for checking auth state

import { rule, shield } from "graphql-shield";

const isAuthenticated = rule()(async (_parent, _args, ctx) => {
  // TODO: Remove when no longer needed for testing
  console.log(ctx.claims);

  return true;
});

const permissions = shield(
  {
    Query: {
      posts: isAuthenticated,
    },
  },
  {
    fallbackError: "Unauthorized",
  }
);

export default permissions;
