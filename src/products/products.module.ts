import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ImagesModule } from "../images/images.module";
import { Product } from "./models/product.model";
import { ProductsController } from "./products.controller";
import { ProductsResolver } from "./products.resolver";
import { ProductsService } from "./products.service";

@Module({
  imports: [TypeOrmModule.forFeature([Product]), ImagesModule],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsResolver],
})
export class ProductsModule {}
