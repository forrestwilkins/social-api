import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as fs from "fs";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import {
  generateImageName,
  randomDefaultImagePath,
} from "../images/image.utils";
import { ImagesService, ImageTypes } from "../images/images.service";
import { User } from "./models/user.model";

type UserWithoutPassword = Omit<User, "password">;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    private imagesService: ImagesService
  ) {}

  async getUser(options: FindOneOptions<User>) {
    const user = await this.repository.findOne(options);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  /**
   * TODO: Determine whether excluding password here is necessary
   * Password is already excluded from queryable fields in User model
   */
  async getUserWithoutPassword(
    where: FindOptionsWhere<User> | FindOptionsWhere<User>[],
    relations?: string[]
  ): Promise<UserWithoutPassword> {
    const { password: _password, ...userWithoutPassword } = await this.getUser({
      where,
      relations,
    });
    return userWithoutPassword;
  }

  async getUserProfile(
    where: FindOptionsWhere<User> | FindOptionsWhere<User>[]
  ): Promise<UserWithoutPassword> {
    const { images, ...user } = await this.getUserWithoutPassword(where, [
      "posts.images",
      "images",
    ]);
    const profilePictures = images.filter(
      (image) => image.imageType === ImageTypes.ProfilePicture
    );
    const coverPhotos = images.filter(
      (image) => image.imageType === ImageTypes.CoverPhoto
    );
    const profilePicture = profilePictures[profilePictures.length - 1];
    const coverPhoto = coverPhotos[profilePictures.length - 1];
    return { profilePicture, coverPhoto, ...user };
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
    return this.getUserWithoutPassword({ id: userId });
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

  async saveDefaultProfilePicture(userId: number) {
    const sourcePath = randomDefaultImagePath();
    const filename = `${generateImageName()}.jpeg`;
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
