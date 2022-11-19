// TODO: Remove async keyword from resolver functions

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
import { GroupMember } from "../group-members/models/group-member.model";
import { Group } from "../models/group.model";
import { MemberRequestsService } from "./member-requests.service";
import { MemberRequest } from "./models/member-request.model";

@Resolver(() => MemberRequest)
@UseGuards(GqlAuthGuard)
export class MemberRequestsResolver {
  constructor(private service: MemberRequestsService) {}

  @Query(() => MemberRequest, { nullable: true })
  async memberRequest(
    @Args("groupId", { type: () => Int }) groupId: number,
    @CurrentUser() { id: userId }: User
  ) {
    return this.service.getMemberRequest({ groupId, userId });
  }

  // TODO: Ensure only users with permission can access member requests
  @Query(() => [MemberRequest])
  async memberRequests(
    @Args("groupName", { type: () => String }) groupName: string
  ) {
    return this.service.getMemberRequests(groupName);
  }

  @ResolveField(() => Group)
  async group(
    @Context() { loaders }: { loaders: Dataloaders },
    @Parent() { groupId }: MemberRequest
  ) {
    return loaders.groupsLoader.load(groupId);
  }

  @ResolveField(() => User)
  async user(
    @Context() { loaders }: { loaders: Dataloaders },
    @Parent() { userId }: MemberRequest
  ) {
    return loaders.usersLoader.load(userId);
  }

  @Mutation(() => MemberRequest)
  async createMemberRequest(
    @Args("groupId", { type: () => Int }) groupId: number,
    @CurrentUser() { id: userId }: User
  ) {
    return this.service.createMemberRequest(groupId, userId);
  }

  @Mutation(() => GroupMember)
  async approveMemberRequest(@Args("id", { type: () => Int }) id: number) {
    return this.service.approveMemberRequest(id);
  }

  @Mutation(() => Boolean)
  async denyMemberRequest(@Args("id", { type: () => Int }) id: number) {
    return this.service.denyMemberRequest(id);
  }

  // TODO: Replace Group return type with CancelMemberRequestPayload type that contains group
  @Mutation(() => Group)
  async cancelMemberRequest(@Args("id", { type: () => Int }) id: number) {
    return this.service.cancelMemberRequest(id);
  }
}
