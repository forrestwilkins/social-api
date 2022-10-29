import { Module } from "@nestjs/common";
import { GroupsModule } from "../groups/groups.module";
import { MemberRequestsModule } from "../groups/member-requests/member-requests.module";
import { PostsModule } from "../posts/posts.module";
import { UsersModule } from "../users/users.module";
import { DataloaderService } from "./dataloader.service";

@Module({
  imports: [UsersModule, PostsModule, GroupsModule, MemberRequestsModule],
  providers: [DataloaderService],
  exports: [DataloaderService],
})
export class DataloaderModule {}
