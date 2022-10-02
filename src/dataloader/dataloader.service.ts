import { Injectable } from "@nestjs/common";
import * as DataLoader from "dataloader";
import { Image } from "../images/models/image.model";
import { PostsService } from "../posts/posts.service";
import { User } from "../users/models/user.model";
import { UsersService } from "../users/users.service";

export interface Dataloaders {
  postImagesLoader: DataLoader<number, Image[]>;
  profilePicturesLoader: DataLoader<number, Image>;
  usersLoader: DataLoader<number, User>;
}

@Injectable()
export class DataloaderService {
  constructor(
    private postsService: PostsService,
    private usersService: UsersService
  ) {}

  getLoaders(): Dataloaders {
    const postImagesLoader = this._createPostImagesLoader();
    const profilePicturesLoader = this._createProfilePicturesLoader();
    const usersLoader = this._createUsersLoader();

    return {
      postImagesLoader,
      profilePicturesLoader,
      usersLoader,
    };
  }

  private _createUsersLoader() {
    return new DataLoader<number, User>(async (userIds) =>
      this.usersService.getUsersByBatch(userIds as number[])
    );
  }

  private _createProfilePicturesLoader() {
    return new DataLoader<number, Image>(async (userIds) =>
      this.usersService.getProfilePicturesByBatch(userIds as number[])
    );
  }

  private _createPostImagesLoader() {
    return new DataLoader<number, Image[]>(async (postIds) =>
      this.postsService.getPostImagesByBatch(postIds as number[])
    );
  }
}
