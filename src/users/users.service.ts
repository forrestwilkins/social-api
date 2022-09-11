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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    private imagesService: ImagesService
  ) {}

  async getUser(options: FindOneOptions<User>) {
    return this.repository.findOne(options);
  }

  /**
   * TODO: Determine whether excluding password here is necessary
   * Password is already excluded from queryable fields in User model
   */
  async getUserWithoutPassword(
    where: FindOptionsWhere<User> | FindOptionsWhere<User>[]
  ): Promise<Omit<User, "password">> {
    try {
      const { password: _password, ...userWithoutPassword } =
        await this.getUser({
          where,
        });
      return userWithoutPassword;
    } catch {
      throw new Error("Failed to find user");
    }
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
