import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "./models/role.model";
import { PermissionsModule } from "./permissions/permissions.module";
import { RolesResolver } from "./roles.resolver";
import { RolesService } from "./roles.service";

@Module({
  imports: [TypeOrmModule.forFeature([Role]), PermissionsModule],
  providers: [RolesService, RolesResolver],
})
export class RolesModule {}
