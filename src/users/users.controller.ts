import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UploadImage } from "../images/decorators/upload-image.decorator";
import { UsersService } from "./users.service";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly service: UsersService) {}

  // TODO: Fully test endpoint
  @Post(":userId/profile-picture")
  @UploadImage()
  @UseGuards(JwtAuthGuard)
  async uploadProfilePicture(
    @Param("userId", ParseIntPipe) userId: number,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this.service.saveProfilePicture(userId, image);
  }
}
