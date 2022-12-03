import { Module } from "@nestjs/common";
import { RoleMembersService } from "./role-members.service";
import { RoleMembersResolver } from "./role-members.resolver";

@Module({
  providers: [RoleMembersService, RoleMembersResolver],
})
export class RoleMembersModule {}
