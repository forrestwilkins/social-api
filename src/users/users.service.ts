import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";
import { ImagesService } from "../images/images.service";
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
    return this.usersRepository.save(data);
  }

  async updateUser(userId: number, data: Partial<User>) {
    return this.usersRepository.update(userId, data);
  }

  async saveProfilePicture(postId: number, { filename }: Express.Multer.File) {
    return this.imagesService.createImage({
      filename,
      postId,
      imageType: "profilePicture",
    });
  }

  async deleteUser(userId: number) {
    return this.usersRepository.delete(userId);
  }
}
