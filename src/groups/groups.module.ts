import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Group } from "./models/group.model";
import { GroupsResolver } from "./groups.resolver";
import { GroupsService } from "./groups.service";

@Module({
  imports: [TypeOrmModule.forFeature([Group])],
  providers: [GroupsService, GroupsResolver],
})
export class GroupsModule {}
