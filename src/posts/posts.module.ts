import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ImagesModule } from "../images/images.module";
import { Post } from "./models/post.model";
import { PostsController } from "./posts.controller";
import { PostsResolver } from "./posts.resolver";
import { PostsService } from "./posts.service";

@Module({
  imports: [TypeOrmModule.forFeature([Post]), ImagesModule],
  controllers: [PostsController],
  providers: [PostsService, PostsResolver],
})
export class PostsModule {}
