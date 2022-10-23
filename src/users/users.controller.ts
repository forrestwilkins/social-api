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
import { UsersService } from "./users.service";

@ApiTags("users")
@Controller("users")
@UseGuards(JwtAuthGuard)
@UseInterceptors(ImagesInterceptor)
export class UsersController {
  constructor(private service: UsersService) {}

  @Post(":id/profile-picture")
  @UploadImage()
  async uploadProfilePicture(
    @Param("id", ParseIntPipe) id: number,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this.service.saveProfilePicture(id, image);
  }

  @Post(":id/cover-photo")
  @UploadImage()
  async uploadCoverPhoto(
    @Param("id", ParseIntPipe) id: number,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this.service.saveCoverPhoto(id, image);
  }
}
