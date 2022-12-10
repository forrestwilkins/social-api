import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { RefreshTokensModule } from "./auth/refresh-tokens/refresh-tokens.module";
import { RefreshTokensService } from "./auth/refresh-tokens/refresh-tokens.service";
import typeOrmConfig from "./config/typeorm.config";
import graphQLConfig from "./config/graphql.config";
import { DataloaderModule } from "./dataloader/dataloader.module";
import { DataloaderService } from "./dataloader/dataloader.service";
import { GroupsModule } from "./groups/groups.module";
import { ImagesModule } from "./images/images.module";
import { PostsModule } from "./posts/posts.module";
import { RolesModule } from "./roles/roles.module";
import { UsersModule } from "./users/users.module";
import { UsersService } from "./users/users.service";

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [DataloaderModule, UsersModule, RefreshTokensModule],
      inject: [DataloaderService, UsersService, RefreshTokensService],
      useFactory: graphQLConfig,
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
