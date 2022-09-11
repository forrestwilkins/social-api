import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ImagesController } from "./images.controller";
import { ImagesResolver } from "./images.resolver";
import { ImagesService } from "./images.service";
import { Image } from "./models/image.model";

export const UPLOADS_DIR = "./uploads";

@Module({
  imports: [
    TypeOrmModule.forFeature([Image]),
    MulterModule.register({
      dest: UPLOADS_DIR,
    }),
  ],
  providers: [ImagesService, ImagesResolver],
  controllers: [ImagesController],
  exports: [ImagesService],
})
export class ImagesModule {}
