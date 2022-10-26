import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { MemberRequestsService } from "./member-requests.service";
import { MemberRequest } from "./models/member-request.model";

@Resolver()
export class MemberRequestsResolver {
  constructor(private service: MemberRequestsService) {}

  @Query(() => [MemberRequest])
  async memberRequests() {
    return this.service.getMemberRequests();
  }

  @Mutation(() => MemberRequest)
  async createMemberRequest(
    @Args("groupId") groupId: number,
    @Args("userId") userId: number
  ) {
    return this.service.createMemberRequest(groupId, userId);
  }
}
