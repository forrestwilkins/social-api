import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ImagesModule } from "../images/images.module";
import { PostsModule } from "../posts/posts.module";
import { GroupMembersModule } from "./group-members/group-members.module";
import { GroupsController } from "./groups.controller";
import { GroupsResolver } from "./groups.resolver";
import { GroupsService } from "./groups.service";
import { MemberRequestsModule } from "./member-requests/member-requests.module";
import { Group } from "./models/group.model";

@Module({
  imports: [
    TypeOrmModule.forFeature([Group]),
    GroupMembersModule,
    MemberRequestsModule,
    ImagesModule,
    PostsModule,
  ],
  providers: [GroupsService, GroupsResolver],
  controllers: [GroupsController],
  exports: [GroupsService],
})
export class GroupsModule {}
