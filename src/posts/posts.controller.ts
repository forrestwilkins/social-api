import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UploadImages } from "../images/decorators/upload-images.decorator";
import { ImagesInterceptor } from "../images/images.interceptor";
import { PostsService } from "./posts.service";

@ApiTags("posts")
@Controller("posts")
@UseGuards(JwtAuthGuard)
@UseInterceptors(ImagesInterceptor)
export class PostsController {
  constructor(private service: PostsService) {}

  @Post(":postId/images")
  @UploadImages()
  async uploadPostImages(
    @Param("postId", ParseIntPipe) postId: number,
    @UploadedFiles() images: Express.Multer.File[]
  ) {
    return this.service.savePostImages(postId, images);
  }
}
