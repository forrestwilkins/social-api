import { Query, Resolver } from "@nestjs/graphql";
import { MemberRequestsService } from "./member-requests.service";
import { MemberRequest } from "./models/member-request.model";

@Resolver()
export class MemberRequestsResolver {
  constructor(private service: MemberRequestsService) {}

  @Query(() => [MemberRequest])
  async memberRequests() {
    return this.service.getMemberRequests();
  }
}
