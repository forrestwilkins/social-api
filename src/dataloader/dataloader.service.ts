import { Injectable } from "@nestjs/common";
import * as DataLoader from "dataloader";
import { In } from "typeorm";
import { ImagesService } from "../images/images.service";
import { Image } from "../images/models/image.model";
import { User } from "../users/models/user.model";
import { UsersService } from "../users/users.service";

export interface Dataloaders {
  imagesLoader: DataLoader<number, Image[]>;
  usersLoader: DataLoader<number, User>;
}

@Injectable()
export class DataloaderService {
  constructor(
    private imagesService: ImagesService,
    private usersService: UsersService
  ) {}

  getLoaders(): Dataloaders {
    const imagesLoader = this._createImagesLoader();
    const usersLoader = this._createUsersLoader();
    return { imagesLoader, usersLoader };
  }

  _createUsersLoader() {
    return new DataLoader<number, User>(async (userIds) => {
      const users = await this.usersService.getUsers({
        id: In(userIds as number[]),
      });
      const mappedUsers = userIds.map(
        (id) =>
          users.find((user: User) => user.id === id) ||
          new Error(`Could not load user ${id}`)
      );
      return mappedUsers;
    });
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
