import { GraphQLSchema } from "graphql";
import { applyMiddleware } from "graphql-middleware";
import { getClaims, getSub } from "../auth/auth.utils";
import { RefreshTokensService } from "../auth/refresh-tokens/refresh-tokens.service";
import shieldPermissions from "../auth/shield/shield.permissions";
import { DataloaderService } from "../dataloader/dataloader.service";
import { UsersService } from "../users/users.service";
import { Environments } from "../shared/shared.constants";
import { Context } from "../shared/shared.types";

const graphQLConfig = (
  dataloaderService: DataloaderService,
  usersService: UsersService,
  refreshTokensService: RefreshTokensService
) => ({
  context: async ({ req }: { req: Request }): Promise<Context> => {
    const claims = getClaims(req);
    const sub = getSub(claims.accessTokenClaims);

    const loaders = dataloaderService.getLoaders();
    const permissions = sub ? await usersService.getUserPermissions(sub) : null;
    const user = sub ? await usersService.getUser({ id: sub }) : null;

    return {
      claims,
      loaders,
      permissions,
      refreshTokensService,
      usersService,
      user,
    };
  },
  transformSchema: (schema: GraphQLSchema) => {
    schema = applyMiddleware(schema, shieldPermissions);
    return schema;
  },
  autoSchemaFile: true,
  cors: { origin: true, credentials: true },
  csrfPrevention: process.env.NODE_ENV !== Environments.Development,
});

export default graphQLConfig;
