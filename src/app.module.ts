import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GraphQLSchema } from "graphql";
import { applyMiddleware } from "graphql-middleware";
import { rule, shield } from "graphql-shield";
import { AuthModule } from "./auth/auth.module";
import { DataloaderModule } from "./dataloader/dataloader.module";
import { DataloaderService } from "./dataloader/dataloader.service";
import { GroupsModule } from "./groups/groups.module";
import { ImagesModule } from "./images/images.module";
import ormconfig from "./ormconfig";
import { PostsModule } from "./posts/posts.module";
import { RolesModule } from "./roles/roles.module";
import { UsersModule } from "./users/users.module";

// TODO: Add logic for checking auth state
const isAuthenticated = rule()(async () => true);

// TODO: Add remaining permissions and move to own file
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

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [DataloaderModule],
      inject: [DataloaderService],
      useFactory: (dataloaderService: DataloaderService) => ({
        autoSchemaFile: true,
        cors: { origin: true, credentials: true },
        csrfPrevention: process.env.NODE_ENV !== "development",
        context: () => ({
          loaders: dataloaderService.getLoaders(),
        }),
        transformSchema: (schema: GraphQLSchema) => {
          schema = applyMiddleware(schema, permissions);
          return schema;
        },
      }),
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
