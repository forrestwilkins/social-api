import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UploadedFiles,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UploadImages } from "./decorators/upload-images.decorator";
import { ImagesService } from "./images.service";

@ApiTags("images")
@Controller("images")
export class ImagesController {
  constructor(private service: ImagesService) {}

  @Get(":imageId/view")
  async getImageFile(
    @Param("imageId", ParseIntPipe) imageId: number,
    @Res() res: Response
  ) {
    const image = await this.service.getImage(imageId);
    return res.sendFile(image.filename, { root: "./uploads" });
  }

  // TODO: Determine whether this handler is still needed
  @Post()
  @UploadImages()
  @UseGuards(JwtAuthGuard)
  async uploadImages(@UploadedFiles() images: Express.Multer.File[]) {
    return this.service.saveImages(images);
  }
}
