import { Args, Int, Mutation, Resolver } from "@nestjs/graphql";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { saveImage } from "./image.utils";
import { ImagesService } from "./images.service";
import { Image } from "./models/image.model";

@Resolver(() => Image)
export class ImagesResolver {
  constructor(private service: ImagesService) {}

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
  async deleteImage(@Args("id", { type: () => Int }) id: number) {
    return this.service.deleteImage({ id });
  }
}
