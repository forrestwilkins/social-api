import { UseGuards } from "@nestjs/common";
import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { GqlAuthGuard } from "../../auth/guards/gql-auth.guard";
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

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async leaveGroup(
    @Args("groupId", { type: () => Int }) groupId: number,
    @CurrentUser() { id: userId }: User
  ) {
    return this.service.deleteGroupMember({ groupId, userId });
  }
}
