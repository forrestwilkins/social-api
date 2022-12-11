import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "./models/role.model";
import { PermissionsModule } from "./permissions/permissions.module";
import { RoleMembersModule } from "./role-members/role-members.module";
import { RolesResolver } from "./roles.resolver";
import { RolesService } from "./roles.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    PermissionsModule,
    RoleMembersModule,
  ],
  providers: [RolesService, RolesResolver],
  exports: [RolesService],
})
export class RolesModule {}
