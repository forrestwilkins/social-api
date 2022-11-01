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
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { Dataloaders } from "../dataloader/dataloader.service";
import { PostsService } from "../posts/posts.service";
import { User } from "../users/models/user.model";
import { GroupMembersService } from "./group-members/group-members.service";
import { GroupMember } from "./group-members/models/group-member.model";
import { GroupsService } from "./groups.service";
import { GroupInput } from "./models/group-input.model";
import { Group } from "./models/group.model";

@Resolver(() => Group)
export class GroupsResolver {
  constructor(
    private groupsService: GroupsService,
    private groupMembersService: GroupMembersService,
    private postsService: PostsService
  ) {}

  @Query(() => Group)
  async group(@Args("name", { type: () => String }) name: string) {
    return this.groupsService.getGroup({ name });
  }

  @Query(() => [Group])
  async groups() {
    return this.groupsService.getGroups();
  }

  @ResolveField(() => Image)
  async posts(@Parent() { id }: Group) {
    return this.postsService.getPosts({ groupId: id });
  }

  @ResolveField(() => Image)
  async coverPhoto(@Parent() { id }: Group) {
    return this.groupsService.getCoverPhoto(id);
  }

  @ResolveField(() => GroupMember)
  async members(@Parent() { id }: Group) {
    return this.groupMembersService.getGroupMembers({ groupId: id });
  }

  @ResolveField(() => Int)
  async memberCount(
    @Parent() { id }: Group,
    @Context() { loaders }: { loaders: Dataloaders }
  ) {
    return loaders.groupMemberCountLoader.load(id);
  }

  @ResolveField(() => Int)
  async memberRequestCount(
    @Parent() { id }: Group,
    @Context() { loaders }: { loaders: Dataloaders }
  ) {
    return loaders.memberRequestCountLoader.load(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Group)
  async createGroup(@Args("groupData") groupData: GroupInput) {
    return this.groupsService.createGroup(groupData);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Group)
  async updateGroup(@Args("groupData") groupData: GroupInput) {
    return this.groupsService.updateGroup(groupData);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deleteGroup(@Args("id", { type: () => Int }) id: number) {
    return this.groupsService.deleteGroup(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async leaveGroup(
    @Args("id", { type: () => Int }) id: number,
    @CurrentUser() { id: userId }: User
  ) {
    return this.groupsService.leaveGroup(id, userId);
  }
}
