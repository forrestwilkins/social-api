import { Injectable } from "@nestjs/common";
import * as DataLoader from "dataloader";
import { In } from "typeorm";
import { ImagesService } from "../images/images.service";
import { Image } from "../images/models/image.model";

export interface Dataloaders {
  imagesLoader: DataLoader<number, Image[]>;
}

@Injectable()
export class DataloaderService {
  constructor(private imagesService: ImagesService) {}

  getLoaders(): Dataloaders {
    const imagesLoader = this._createImagesLoader();
    return { imagesLoader };
  }

  _createImagesLoader() {
    return new DataLoader<number, Image[]>(async (postIds) => {
      const images = await this.imagesService.getImages({
        postId: In(postIds as number[]),
      });
      const mappedImages = postIds.map(
        (id) =>
          images.filter((image: Image) => image.postId === id) ||
          new Error(`Could not load image ${id}`)
      );
      return mappedImages;
    });
  }
}
