import { Query, Resolver } from "@nestjs/graphql";
import { GroupMembersService } from "./group-members.service";
import { GroupMember } from "./models/group-member.model";

@Resolver()
export class GroupMembersResolver {
  constructor(private service: GroupMembersService) {}

  @Query(() => [GroupMember])
  async groupMembers() {
    return this.service.getGroupMembers();
  }
}
