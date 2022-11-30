import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GraphQLSchema } from "graphql";
import { applyMiddleware } from "graphql-middleware";
import { AuthModule } from "./auth/auth.module";
import { DataloaderModule } from "./dataloader/dataloader.module";
import { DataloaderService } from "./dataloader/dataloader.service";
import { GroupsModule } from "./groups/groups.module";
import { ImagesModule } from "./images/images.module";
import ormconfig from "./ormconfig";
import { PostsModule } from "./posts/posts.module";
import permissions from "./auth/shield";
import { RolesModule } from "./roles/roles.module";
import { Environments } from "./shared/shared.constants";
import { UsersModule } from "./users/users.module";
import { getClaims } from "./auth/auth.utils";

const useFactory = (dataloaderService: DataloaderService) => ({
  context: ({ req }: { req: Request }) => ({
    loaders: dataloaderService.getLoaders(),
    claims: getClaims(req),
  }),
  transformSchema: (schema: GraphQLSchema) => {
    schema = applyMiddleware(schema, permissions);
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
      imports: [DataloaderModule],
      inject: [DataloaderService],
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
