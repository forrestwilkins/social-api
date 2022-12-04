import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GraphQLSchema } from "graphql";
import { applyMiddleware } from "graphql-middleware";
import { AuthModule } from "./auth/auth.module";
import { getClaims } from "./auth/auth.utils";
import shieldPermissions from "./auth/shield";
import { DataloaderModule } from "./dataloader/dataloader.module";
import { DataloaderService } from "./dataloader/dataloader.service";
import { GroupsModule } from "./groups/groups.module";
import { ImagesModule } from "./images/images.module";
import ormconfig from "./ormconfig";
import { PostsModule } from "./posts/posts.module";
import { RolesModule } from "./roles/roles.module";
import { Context } from "./shared/shared.types";
import { Environments } from "./shared/shared.constants";
import { UsersModule } from "./users/users.module";
import { UsersService } from "./users/users.service";

const useFactory = (
  dataloaderService: DataloaderService,
  usersService: UsersService
) => ({
  context: async ({ req }: { req: Request }): Promise<Context> => {
    const claims = getClaims(req);
    const userId = claims?.sub ? parseInt(claims.sub) : undefined;

    const loaders = dataloaderService.getLoaders();
    const permissions = userId
      ? await usersService.getUserPermissions(userId)
      : undefined;
    const user = userId
      ? await usersService.getUser({ id: userId })
      : undefined;

    return {
      loaders,
      permissions,
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

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [DataloaderModule, UsersModule],
      inject: [DataloaderService, UsersService],
      useFactory,
    }),
    AuthModule,
    DataloaderModule,
    GroupsModule,
    ImagesModule,
    PostsModule,
    RolesModule,
    UsersModule,
  ],
})
export class AppModule {}
