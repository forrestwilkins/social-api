import { Injectable } from "@nestjs/common";
import * as DataLoader from "dataloader";
import { createImagesLoader } from "../images/images.loader";
import { ImagesService } from "../images/images.service";
import { Image } from "../images/models/image.model";

export interface Dataloaders {
  imagesLoader: DataLoader<number, Image[]>;
}

@Injectable()
export class DataloaderService {
  constructor(private imagesService: ImagesService) {}

  getLoaders(): Dataloaders {
    const imagesLoader = createImagesLoader(this.imagesService);
    return { imagesLoader };
  }
}
