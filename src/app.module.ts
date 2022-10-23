import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { DataloaderModule } from "./dataloader/dataloader.module";
import { DataloaderService } from "./dataloader/dataloader.service";
import { GroupsModule } from "./groups/groups.module";
import { ImagesModule } from "./images/images.module";
import ormconfig from "./ormconfig";
import { PostsModule } from "./posts/posts.module";
import { UsersModule } from "./users/users.module";
import { GroupMembersModule } from "./group-members/group-members.module";
import { MemberRequestsModule } from "./member-requests/member-requests.module";
import { GroupMembersService } from "./group-members/group-members.service";
import { MemberRequestsService } from "./member-requests/member-requests.service";

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
      }),
    }),
    AuthModule,
    DataloaderModule,
    GroupsModule,
    ImagesModule,
    PostsModule,
    UsersModule,
    GroupMembersModule,
    MemberRequestsModule,
  ],
  providers: [GroupMembersService, MemberRequestsService],
})
export class AppModule {}
