import { UseGuards } from "@nestjs/common";
import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { PostsService } from "../posts/posts.service";
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
  async deleteGroup(@Args("id", { type: () => ID }) id: number) {
    return this.groupsService.deleteGroup(id);
  }
}
