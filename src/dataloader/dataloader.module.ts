import { Module } from "@nestjs/common";
import { ImagesModule } from "../images/images.module";
import { PostsModule } from "../posts/posts.module";
import { DataloaderService } from "./dataloader.service";

@Module({
  imports: [PostsModule, ImagesModule],
  providers: [DataloaderService],
  exports: [DataloaderService],
})
export class DataloaderModule {}
