import { Injectable } from "@nestjs/common";
import * as DataLoader from "dataloader";
import { Image } from "../images/models/image.model";
import { PostsService } from "../posts/posts.service";
import { User } from "../users/models/user.model";
import { UsersService } from "../users/users.service";
import { Dataloaders } from "./dataloader.interface";

@Injectable()
export class DataloaderService {
  constructor(
    private postsService: PostsService,
    private usersService: UsersService
  ) {}

  getLoaders(): Dataloaders {
    const postImagesLoader = this._createPostImagesLoader();
    const usersLoader = this._createUsersLoader();
    return {
      postImagesLoader,
      usersLoader,
    };
  }

  private _createUsersLoader() {
    return new DataLoader<number, User>(async (userIds) =>
      this.usersService.getUsersByBatch(userIds as number[])
    );
  }

  private _createPostImagesLoader() {
    return new DataLoader<number, Image[]>(async (postIds) =>
      this.postsService.getPostImagesByBatch(postIds as number[])
    );
  }
}
