import { UseGuards } from "@nestjs/common";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { FileUpload, GraphQLUpload } from "graphql-upload-minimal";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { saveImage } from "./image.utils";
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

  // TODO: Remove when no longer needed for testing
  @Mutation(() => Image)
  async uploadImage(
    @Args("image", { type: () => GraphQLUpload }) image: Promise<FileUpload>
  ) {
    console.log("Attempting to save image:", image);
    const filename = await saveImage(image);
    console.log("Saved image:", filename);

    const imageEntity = await this.service.createImage({
      filename,
    });
    console.log("Image entity:", imageEntity);

    return imageEntity;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteImage(@Args("id", { type: () => ID }) id: number) {
    return this.service.deleteImage(id);
  }
}
