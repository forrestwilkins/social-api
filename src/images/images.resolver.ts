import { UseGuards } from "@nestjs/common";
import { Args, ID, Mutation, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { ImagesService } from "./images.service";
import { Image } from "./models/image.model";

@Resolver(() => Image)
export class ImagesResolver {
  constructor(private service: ImagesService) {}

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteImage(@Args("id", { type: () => ID }) id: number) {
    return this.service.deleteImage({ id });
  }
}
