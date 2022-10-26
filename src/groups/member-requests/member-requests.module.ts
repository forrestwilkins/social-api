import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MemberRequestsResolver } from "./member-requests.resolver";
import { MemberRequestsService } from "./member-requests.service";
import { MemberRequest } from "./models/member-request.model";

@Module({
  imports: [TypeOrmModule.forFeature([MemberRequest])],
  providers: [MemberRequestsResolver, MemberRequestsService],
})
export class MemberRequestsModule {}
