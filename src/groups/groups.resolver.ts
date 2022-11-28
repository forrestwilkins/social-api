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
import { Post } from "../posts/models/post.model";
import { PostsService } from "../posts/posts.service";
import { User } from "../users/models/user.model";
import { GroupMember } from "./group-members/models/group-member.model";
import { GroupsService } from "./groups.service";
import { CreateGroupInput } from "./models/create-group.input";
import { CreateGroupPayload } from "./models/create-group.payload";
import { Group } from "./models/group.model";
import { UpdateGroupInput } from "./models/update-group.input";
import { UpdateGroupPayload } from "./models/update-group.payload";

@Resolver(() => Group)
export class GroupsResolver {
  constructor(
    private groupsService: GroupsService,
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

  @ResolveField(() => [Post])
  async posts(@Parent() { id }: Group) {
    return this.postsService.getPosts({ groupId: id });
  }

  @ResolveField(() => Image)
  async coverPhoto(
    @Parent() { id }: Group,
    @Context() { loaders }: { loaders: Dataloaders }
  ) {
    return loaders.groupCoverPhotosLoader.load(id);
  }

  @ResolveField(() => [GroupMember])
  async members(
    @Parent() { id }: Group,
    @Context() { loaders }: { loaders: Dataloaders }
  ) {
    return loaders.groupMembersLoader.load(id);
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
  @Mutation(() => CreateGroupPayload)
  async createGroup(
    @Args("groupData") groupData: CreateGroupInput,
    @CurrentUser() { id: userId }: User
  ) {
    return this.groupsService.createGroup(groupData, userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UpdateGroupPayload)
  async updateGroup(@Args("groupData") groupData: UpdateGroupInput) {
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
