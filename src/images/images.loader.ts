import * as DataLoader from "dataloader";
import { In } from "typeorm";
import { ImagesService } from "./images.service";
import { Image } from "./models/image.model";

const mapPostIdsToImages = (postIds: readonly number[], images: Image[]) =>
  postIds.map(
    (id) =>
      images.filter((image: Image) => image.postId === id) ||
      new Error(`Could not load image ${id}`)
  );

export const createImagesLoader = (imagesService: ImagesService) =>
  new DataLoader<number, Image[]>(async (postIds) => {
    const images = await imagesService.getImages({
      postId: In(postIds as number[]),
    });
    const mappedResults = mapPostIdsToImages(postIds, images);
    return mappedResults;
  });
