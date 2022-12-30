import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserInputError } from "apollo-server-express";
import * as fs from "fs";
import { FindOptionsWhere, In, Repository } from "typeorm";
import { randomDefaultImagePath } from "../images/image.utils";
import { ImagesService, ImageTypes } from "../images/images.service";
import { Image } from "../images/models/image.model";
import { PostsService } from "../posts/posts.service";
import { RoleMembersService } from "../roles/role-members/role-members.service";
import { RolesService } from "../roles/roles.service";
import { UpdateUserInput } from "./models/update-user.input";
import { User } from "./models/user.model";

export interface UserPermissions {
  serverPermissions: Set<string>;
  groupPermissions: Record<number, Set<string>>;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,

    @Inject(forwardRef(() => RolesService))
    private rolesService: RolesService,

    private imagesService: ImagesService,
    private postsService: PostsService,
    private roleMembersService: RoleMembersService
  ) {}

  async getUser(where: FindOptionsWhere<User>) {
    return await this.repository.findOne({ where });
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
        new Error(`Could not load user: ${id}`)
    );
    return mappedUsers;
  }

  async getProfilePicturesByBatch(userIds: number[]) {
    const profilePictures = await this.imagesService.getImages({
      imageType: ImageTypes.ProfilePicture,
      userId: In(userIds),
    });
    const mappedProfilePictures = userIds.map(
      (id) =>
        profilePictures.find(
          (profilePicture: Image) => profilePicture.userId === id
        ) || new Error(`Could not load profile picture: ${id}`)
    );
    return mappedProfilePictures;
  }

  async getCoverPhoto(userId: number) {
    return this.imagesService.getImage({
      imageType: ImageTypes.CoverPhoto,
      userId,
    });
  }

  async getUserPermissions(id: number) {
    const roleMembers = await this.roleMembersService.getRoleMembers({
      where: { user: { id } },
      relations: ["role.permissions"],
    });
    return roleMembers.reduce<UserPermissions>(
      (result, { role: { groupId, permissions } }) => {
        for (const { name, enabled } of permissions) {
          if (!enabled) {
            continue;
          }
          if (groupId) {
            result.groupPermissions[groupId].add(name);
            continue;
          }
          result.serverPermissions.add(name);
        }
        return result;
      },
      { serverPermissions: new Set(), groupPermissions: {} }
    );
  }

  async isUsersPost(postId: number, userId?: number) {
    const post = await this.postsService.getPost(postId);
    if (!post) {
      throw new UserInputError("Post not found");
    }
    return post.userId === userId;
  }

  async createUser(data: Partial<User>) {
    const user = await this.repository.save(data);
    const users = await this.getUsers();

    try {
      if (users.length === 1) {
        await this.rolesService.initializeServerAdminRole(user.id);
      }
      await this.saveDefaultProfilePicture(user.id);
    } catch {
      await this.deleteUser(user.id);
      throw new Error("Could not create user");
    }

    return user;
  }

  async updateUser({ id, ...userData }: UpdateUserInput) {
    await this.repository.update(id, userData);
    const user = await this.getUser({ id });
    return { user };
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
