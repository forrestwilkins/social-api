import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Group } from "./models/group.model";
import { GroupsResolver } from "./groups.resolver";
import { GroupsService } from "./groups.service";
import { GroupsController } from "./groups.controller";
import { ImagesModule } from "../images/images.module";

@Module({
  imports: [TypeOrmModule.forFeature([Group]), ImagesModule],
  providers: [GroupsService, GroupsResolver],
  controllers: [GroupsController],
})
export class GroupsModule {}
