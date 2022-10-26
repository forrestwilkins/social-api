import { UseGuards } from "@nestjs/common";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "../../auth/guards/gql-auth.guard";
import { MemberRequestsService } from "./member-requests.service";
import { MemberRequest } from "./models/member-request.model";

@Resolver()
@UseGuards(GqlAuthGuard)
export class MemberRequestsResolver {
  constructor(private service: MemberRequestsService) {}

  // TODO: Remove when no longer needed for testing
  @Query(() => [MemberRequest])
  async memberRequests() {
    return this.service.getMemberRequests();
  }

  @Mutation(() => MemberRequest)
  async createMemberRequest(
    @Args("groupId", { type: () => Int }) groupId: number,
    @Args("userId", { type: () => Int }) userId: number
  ) {
    return this.service.createMemberRequest(groupId, userId);
  }
}
