import { Module } from "@nestjs/common";
import { PostsModule } from "../posts/posts.module";
import { UsersModule } from "../users/users.module";
import { DataloaderService } from "./dataloader.service";

@Module({
  imports: [UsersModule, PostsModule],
  providers: [DataloaderService],
  exports: [DataloaderService],
})
export class DataloaderModule {}
