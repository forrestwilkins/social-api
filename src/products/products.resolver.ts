import { UseGuards } from "@nestjs/common";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { Product } from "./models/product.model";
import { ProductInput } from "./models/product-input.model";
import { ProductsService } from "./products.service";

@Resolver((_of: Product) => Product)
export class ProductsResolver {
  constructor(private service: ProductsService) {}

  @Query(() => Product)
  async product(@Args("id", { type: () => ID }) id: number) {
    return this.service.getProduct(id, true);
  }

  @Query(() => [Product])
  async products() {
    return this.service.getProducts(true);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Product)
  async createProduct(@Args("productData") productData: ProductInput) {
    return this.service.createProduct(productData);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Product)
  async updateProduct(@Args("productData") { id, ...data }: ProductInput) {
    return this.service.updateProduct(id, data);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deleteProduct(@Args("id", { type: () => ID }) id: number) {
    return this.service.deleteProduct(id);
  }
}
