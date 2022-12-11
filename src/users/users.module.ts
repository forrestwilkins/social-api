import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ImagesModule } from "../images/images.module";
import { PostsModule } from "../posts/posts.module";
import { RoleMembersModule } from "../roles/role-members/role-members.module";
import { RolesModule } from "../roles/roles.module";
import { User } from "./models/user.model";
import { UsersController } from "./users.controller";
import { UsersResolver } from "./users.resolver";
import { UsersService } from "./users.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ImagesModule,
    PostsModule,
    RoleMembersModule,
    RolesModule,
  ],
  providers: [UsersService, UsersResolver],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
