import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoleMember } from "./models/role-member.model";
import { RoleMembersResolver } from "./role-members.resolver";
import { RoleMembersService } from "./role-members.service";

@Module({
  imports: [TypeOrmModule.forFeature([RoleMember])],
  providers: [RoleMembersService, RoleMembersResolver],
  exports: [RoleMembersService],
})
export class RoleMembersModule {}
