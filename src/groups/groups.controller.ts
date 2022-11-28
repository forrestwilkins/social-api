import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UploadImage } from "../images/decorators/upload-image.decorator";
import { ImagesInterceptor } from "../images/images.interceptor";
import { GroupsService } from "./groups.service";

@ApiTags("groups")
@Controller("groups")
@UseGuards(JwtAuthGuard)
@UseInterceptors(ImagesInterceptor)
export class GroupsController {
  constructor(private service: GroupsService) {}

  @Post(":id/cover-photo")
  @UploadImage()
  async uploadCoverPhoto(
    @Param("id", ParseIntPipe) id: number,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this.service.saveCoverPhoto(id, image);
  }
}
