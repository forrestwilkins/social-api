import {
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { Dataloaders } from "../../dataloader/dataloader.service";
import { User } from "../../users/models/user.model";
import { GroupMembersService } from "./group-members.service";
import { GroupMember } from "./models/group-member.model";

@Resolver(() => GroupMember)
export class GroupMembersResolver {
  constructor(private service: GroupMembersService) {}

  @Query(() => [GroupMember])
  async groupMembers() {
    return this.service.getGroupMembers();
  }

  @ResolveField(() => User)
  async user(
    @Context() { loaders }: { loaders: Dataloaders },
    @Parent() { userId }: GroupMember
  ) {
    return loaders.usersLoader.load(userId);
  }
}
