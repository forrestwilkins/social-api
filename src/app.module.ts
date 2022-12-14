import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { RefreshTokensModule } from "./auth/refresh-tokens/refresh-tokens.module";
import { RefreshTokensService } from "./auth/refresh-tokens/refresh-tokens.service";
import { DataloaderModule } from "./dataloader/dataloader.module";
import { DataloaderService } from "./dataloader/dataloader.service";
import { GroupsModule } from "./groups/groups.module";
import { GraphQLUpload } from "graphql-upload";
import { ImagesModule } from "./images/images.module";
import { PostsModule } from "./posts/posts.module";
import { RolesModule } from "./roles/roles.module";
import { UsersModule } from "./users/users.module";
import { UsersService } from "./users/users.service";
import { GraphQLSchema } from "graphql";
import { applyMiddleware } from "graphql-middleware";
import { getClaims, getSub } from "./auth/auth.utils";
import shieldPermissions from "./auth/shield/shield.permissions";
import { Environments } from "./shared/shared.constants";
import { Context } from "./shared/shared.types";

const ormConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA,
  entities: ["dist/**/*{.entity,.model}{.ts,.js}"],
  migrations: ["migrations/*.js"],
  synchronize: process.env.NODE_ENV === Environments.Development,
};

const useFactory = (
  dataloaderService: DataloaderService,
  refreshTokensService: RefreshTokensService,
  usersService: UsersService
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
  resolvers: { Upload: GraphQLUpload },
});

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [DataloaderModule, RefreshTokensModule, UsersModule],
      inject: [DataloaderService, RefreshTokensService, UsersService],
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
