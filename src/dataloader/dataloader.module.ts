import { Module } from "@nestjs/common";
import { ImagesModule } from "../images/images.module";
import { UsersModule } from "../users/users.module";
import { DataloaderService } from "./dataloader.service";

@Module({
  imports: [ImagesModule, UsersModule],
  providers: [DataloaderService],
  exports: [DataloaderService],
})
export class DataloaderModule {}
