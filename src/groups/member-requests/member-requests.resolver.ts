import { UseGuards } from "@nestjs/common";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "../../auth/guards/gql-auth.guard";
import { MemberRequestsService } from "./member-requests.service";
import { MemberRequest } from "./models/member-request.model";

@Resolver()
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

  @Query(() => [MemberRequest])
  async memberRequests(@Args("groupId", { type: () => Int }) groupId: number) {
    return this.service.getMemberRequests({ groupId });
  }

  @Mutation(() => MemberRequest)
  async createMemberRequest(
    @Args("groupId", { type: () => Int }) groupId: number,
    @Args("userId", { type: () => Int }) userId: number
  ) {
    return this.service.createMemberRequest(groupId, userId);
  }

  @Mutation(() => Boolean)
  async deleteMemberRequest(@Args("id", { type: () => Int }) id: number) {
    return this.service.deleteMemberRequest(id);
  }
}
