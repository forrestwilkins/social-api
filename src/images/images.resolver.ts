import { UseGuards } from "@nestjs/common";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { ImagesService } from "./images.service";
import { Image } from "./models/image.model";

@Resolver((_of: Image) => Image)
export class ImagesResolver {
  constructor(private service: ImagesService) {}

  @Query(() => Image)
  async image(@Args("id", { type: () => ID }) id: number) {
    return this.service.getImage(id);
  }

  @Query(() => [Image])
  async images() {
    return this.service.getImages();
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteImage(@Args("id", { type: () => ID }) id: number) {
    return this.service.deleteImage(id);
  }
}
