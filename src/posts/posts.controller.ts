import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UploadedFiles,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UploadImages } from "../images/decorators/upload-images.decorator";
import { PostsService } from "./posts.service";

@ApiTags("posts")
@Controller("posts")
export class PostsController {
  constructor(private readonly service: PostsService) {}

  @Post(":postId/upload-images")
  @UploadImages()
  @UseGuards(JwtAuthGuard)
  async uploadPostImages(
    @Param("postId", ParseIntPipe) postId: number,
    @UploadedFiles() images: Express.Multer.File[]
  ) {
    return this.service.savePostImages(postId, images);
  }
}
