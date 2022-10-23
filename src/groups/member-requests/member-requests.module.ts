import { Module } from "@nestjs/common";
import { MemberRequestsResolver } from "./member-requests.resolver";
import { MemberRequestsService } from "./member-requests.service";

@Module({
  providers: [MemberRequestsResolver, MemberRequestsService],
})
export class MemberRequestsModule {}
