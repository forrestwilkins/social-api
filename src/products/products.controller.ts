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
import { ProductsService } from "./products.service";

@ApiTags("products")
@Controller("products")
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Post(":productId/upload-images")
  @UploadImages()
  @UseGuards(JwtAuthGuard)
  async uploadProductImages(
    @Param("productId", ParseIntPipe) productId: number,
    @UploadedFiles() images: Express.Multer.File[]
  ) {
    return this.service.saveProductImages(productId, images);
  }
}
