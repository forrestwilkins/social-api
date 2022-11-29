// TODO: Add remaining permissions and logic for checking auth state

import { rule, shield } from "graphql-shield";

const isAuthenticated = rule()(async () => false);

const permissions = shield(
  {
    Query: {
      users: isAuthenticated,
    },
  },
  {
    fallbackError: "Unauthorized",
  }
);

export default permissions;
