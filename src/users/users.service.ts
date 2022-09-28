import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as fs from "fs";
import { FindOptionsWhere, Repository } from "typeorm";
import { randomDefaultImagePath } from "../images/image.utils";
import { ImagesService, ImageTypes } from "../images/images.service";
import { User } from "./models/user.model";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    private imagesService: ImagesService
  ) {}

  async getUser(where: FindOptionsWhere<User> | FindOptionsWhere<User>[]) {
    const user = await this.repository.findOne({ where });
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

  async updateUser(id: number, data: Partial<User>) {
    await this.repository.update(id, data);
    return this.getUser({ id });
  }

  async getProfilePicture(userId: number) {
    return this.imagesService.getLastImage({
      imageType: ImageTypes.ProfilePicture,
      userId,
    });
  }

  async getCoverPhoto(userId: number) {
    return this.imagesService.getLastImage({
      imageType: ImageTypes.CoverPhoto,
      userId,
    });
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
