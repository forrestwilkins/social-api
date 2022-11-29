import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Permission } from "./models/permission.model";
import { PermissionsResolver } from "./permissions.resolver";
import { PermissionsService } from "./permissions.service";

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
  providers: [PermissionsService, PermissionsResolver],
})
export class PermissionsModule {}
