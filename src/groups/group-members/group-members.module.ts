import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GroupMembersResolver } from "./group-members.resolver";
import { GroupMembersService } from "./group-members.service";
import { GroupMember } from "./models/group-member.model";

@Module({
  imports: [TypeOrmModule.forFeature([GroupMember])],
  providers: [GroupMembersResolver, GroupMembersService],
})
export class GroupMembersModule {}
