import { Controller, Get, Param, ParseIntPipe, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
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
}
