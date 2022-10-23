import { Module } from "@nestjs/common";
import { GroupMembersResolver } from "./group-members.resolver";
import { GroupMembersService } from "./group-members.service";

@Module({
  providers: [GroupMembersResolver, GroupMembersService],
})
export class GroupMembersModule {}
