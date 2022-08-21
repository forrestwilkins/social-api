import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as fs from "fs";
import { FindOneOptions, Repository } from "typeorm";
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
    private usersRepository: Repository<User>,
    private readonly imagesService: ImagesService
  ) {}

  async getUser(options: FindOneOptions<User>) {
    return this.usersRepository.findOne(options);
  }

  async getUserById(id: number): Promise<Omit<User, "password">> {
    try {
      const { password: _password, ...rest } =
        await this.usersRepository.findOneByOrFail({ id });
      return rest;
    } catch {
      throw new Error("Failed to find user");
    }
  }

  async getUsers() {
    return this.usersRepository.find();
  }

  async createUser(data: Partial<User>) {
    const user = await this.usersRepository.save(data);
    await this.saveDefaultProfilePicture(user.id);
    return user;
  }

  async updateUser(userId: number, data: Partial<User>) {
    return this.usersRepository.update(userId, data);
  }

  // TODO: Consider moving to image service
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
    return this.usersRepository.delete(userId);
  }
}
