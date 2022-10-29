import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GroupsModule } from "../groups.module";
import { MemberRequestsModule } from "../member-requests/member-requests.module";
import { GroupMembersResolver } from "./group-members.resolver";
import { GroupMembersService } from "./group-members.service";
import { GroupMember } from "./models/group-member.model";

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupMember]),
    forwardRef(() => GroupsModule),
    forwardRef(() => MemberRequestsModule),
  ],
  providers: [GroupMembersResolver, GroupMembersService],
  exports: [GroupMembersService],
})
export class GroupMembersModule {}
