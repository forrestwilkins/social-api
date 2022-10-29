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
import { GqlAuthGuard } from "../../auth/guards/gql-auth.guard";
import { Dataloaders } from "../../dataloader/dataloader.service";
import { User } from "../../users/models/user.model";
import { GroupMember } from "../group-members/models/group-member.model";
import { MemberRequestsService } from "./member-requests.service";
import { MemberRequestInput } from "./models/member-request-input.model";
import { MemberRequest } from "./models/member-request.model";

@Resolver(() => MemberRequest)
@UseGuards(GqlAuthGuard)
export class MemberRequestsResolver {
  constructor(private service: MemberRequestsService) {}

  @Query(() => MemberRequest, { nullable: true })
  async memberRequest(
    @Args("groupId", { type: () => Int }) groupId: number,
    @Args("userId", { type: () => Int }) userId: number
  ) {
    return this.service.getMemberRequest({ groupId, userId });
  }

  // TODO: Ensure only users with permissions can access member requests
  @Query(() => [MemberRequest])
  async memberRequests(@Args("groupId", { type: () => Int }) groupId: number) {
    return this.service.getMemberRequests({ groupId });
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
    @Args("memberRequestData") memberRequestData: MemberRequestInput
  ) {
    return this.service.createMemberRequest(memberRequestData);
  }

  @Mutation(() => GroupMember)
  async approveMemberRequest(@Args("id", { type: () => Int }) id: number) {
    return this.service.approveMemberRequest(id);
  }

  @Mutation(() => Boolean)
  async denyMemberRequest(@Args("id", { type: () => Int }) id: number) {
    return this.service.denyMemberRequest(id);
  }

  @Mutation(() => Boolean)
  async deleteMemberRequest(@Args("id", { type: () => Int }) id: number) {
    return this.service.deleteMemberRequest(id);
  }
}
