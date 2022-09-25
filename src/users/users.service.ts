import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as fs from "fs";
import { FindOptionsWhere, Repository } from "typeorm";
import { randomDefaultImagePath } from "../images/image.utils";
import { ImagesService, ImageTypes } from "../images/images.service";
import { User } from "./models/user.model";

type WhereUserOptions = FindOptionsWhere<User> | FindOptionsWhere<User>[];

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    private imagesService: ImagesService
  ) {}

  async getUser(where: WhereUserOptions, relations?: string[]) {
    const user = await this.repository.findOne({
      where,
      relations,
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async getUsers() {
    return this.repository.find();
  }

  async createUser(data: Partial<User>) {
    const user = await this.repository.save(data);
    await this.saveDefaultProfilePicture(user.id);
    return user;
  }

  async updateUser(userId: number, data: Partial<User>) {
    await this.repository.update(userId, data);
    return this.getUser({ id: userId });
  }

  async getProfilePicture(userId: number) {
    const profilePictures = await this.imagesService.getImages({
      imageType: ImageTypes.ProfilePicture,
      userId,
    });
    return profilePictures[profilePictures.length - 1];
  }

  async getCoverPhoto(userId: number) {
    const coverPhotos = await this.imagesService.getImages({
      imageType: ImageTypes.CoverPhoto,
      userId,
    });
    return coverPhotos[0];
  }

  async saveProfilePicture(userId: number, { filename }: Express.Multer.File) {
    return this.imagesService.createImage({
      imageType: ImageTypes.ProfilePicture,
      filename,
      userId,
    });
  }

  async saveCoverPhoto(userId: number, { filename }: Express.Multer.File) {
    return this.imagesService.createImage({
      imageType: ImageTypes.CoverPhoto,
      filename,
      userId,
    });
  }

  async saveDefaultProfilePicture(userId: number) {
    const sourcePath = randomDefaultImagePath();
    const filename = `${Date.now()}.jpeg`;
    const copyPath = `./uploads/${filename}`;

    fs.copyFile(sourcePath, copyPath, (err) => {
      if (err) {
        throw new Error(`Failed to save default profile picture: ${err}`);
      }
    });

    const image = await this.imagesService.createImage({
      imageType: ImageTypes.ProfilePicture,
      filename,
      userId,
    });

    return image;
  }

  async deleteUser(userId: number) {
    return this.repository.delete(userId);
  }
}
