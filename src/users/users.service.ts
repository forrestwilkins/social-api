import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as fs from "fs";
import { FindOptionsWhere, In, Repository } from "typeorm";
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

  async getUser(where: FindOptionsWhere<User>) {
    const user = await this.repository.findOne({ where });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async getUsers(where?: FindOptionsWhere<User>) {
    return this.repository.find({ where });
  }

  async getUsersByBatch(userIds: number[]) {
    const users = await this.getUsers({
      id: In(userIds),
    });
    const mappedUsers = userIds.map(
      (id) =>
        users.find((user: User) => user.id === id) ||
        new Error(`Could not load user ${id}`)
    );
    return mappedUsers;
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
    return this.imagesService.getImage({
      imageType: ImageTypes.ProfilePicture,
      userId,
    });
  }

  async getCoverPhoto(userId: number) {
    return this.imagesService.getImage({
      imageType: ImageTypes.CoverPhoto,
      userId,
    });
  }

  async saveProfilePicture(userId: number, { filename }: Express.Multer.File) {
    const imageData = { imageType: ImageTypes.ProfilePicture, userId };
    await this.imagesService.deleteImage(imageData);
    return this.imagesService.createImage({
      ...imageData,
      filename,
    });
  }

  async saveCoverPhoto(userId: number, { filename }: Express.Multer.File) {
    const imageData = { imageType: ImageTypes.CoverPhoto, userId };
    await this.imagesService.deleteImage(imageData);
    return this.imagesService.createImage({
      ...imageData,
      filename,
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
