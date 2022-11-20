import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as fs from "fs";
import { FindOptionsWhere, In, Repository } from "typeorm";
import { randomDefaultImagePath } from "../images/image.utils";
import { ImagesService, ImageTypes } from "../images/images.service";
import { Image } from "../images/models/image.model";
import { GroupMembersService } from "./group-members/group-members.service";
import { MemberRequestsService } from "./member-requests/member-requests.service";
import { GroupInput } from "./models/group-input.model";
import { Group } from "./models/group.model";

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private repository: Repository<Group>,
    private memberRequestsService: MemberRequestsService,
    private groupMembersService: GroupMembersService,
    private imagesService: ImagesService
  ) {}

  async getGroup(where: FindOptionsWhere<Group>) {
    return this.repository.findOne({ where });
  }

  async getGroups(where?: FindOptionsWhere<Group>) {
    return this.repository.find({ where, order: { updatedAt: "DESC" } });
  }

  async getCoverPhoto(groupId: number) {
    return this.imagesService.getImage({
      imageType: ImageTypes.CoverPhoto,
      groupId,
    });
  }

  async getCoverPhotosByBatch(groupIds: number[]) {
    const coverPhotos = await this.imagesService.getImages({
      groupId: In(groupIds),
      imageType: ImageTypes.CoverPhoto,
    });
    const mappedCoverPhotos = groupIds.map(
      (id) =>
        coverPhotos.find((coverPhoto: Image) => coverPhoto.groupId === id) ||
        null
    );
    return mappedCoverPhotos;
  }

  async getGroupsByBatch(groupIds: number[]) {
    const groups = await this.getGroups({
      id: In(groupIds),
    });
    const mappedGroups = groupIds.map(
      (id) =>
        groups.find((group: Group) => group.id === id) ||
        new Error(`Could not load group: ${id}`)
    );
    return mappedGroups;
  }

  async createGroup(groupData: GroupInput, userId: number) {
    const group = await this.repository.save(groupData);
    await this.groupMembersService.createGroupMember(group.id, userId);
    await this.saveDefaultCoverPhoto(group.id);
    return { group };
  }

  async updateGroup({ id, ...groupData }: GroupInput) {
    await this.repository.update(id, groupData);
    const group = await this.getGroup({ id });
    return { group };
  }

  async saveCoverPhoto(groupId: number, { filename }: Express.Multer.File) {
    await this.deleteCoverPhoto(groupId);
    return this.imagesService.createImage({
      imageType: ImageTypes.CoverPhoto,
      filename,
      groupId,
    });
  }

  async saveDefaultCoverPhoto(groupId: number) {
    const sourcePath = randomDefaultImagePath();
    const filename = `${Date.now()}.jpeg`;
    const copyPath = `./uploads/${filename}`;

    fs.copyFile(sourcePath, copyPath, (err) => {
      if (err) {
        throw new Error(`Failed to save default cover photo: ${err}`);
      }
    });
    const image = await this.imagesService.createImage({
      imageType: ImageTypes.CoverPhoto,
      filename,
      groupId,
    });
    return image;
  }

  async deleteGroup(groupId: number) {
    await this.deleteCoverPhoto(groupId);
    await this.repository.delete(groupId);
    return true;
  }

  async deleteCoverPhoto(groupId: number) {
    await this.imagesService.deleteImage({
      imageType: ImageTypes.CoverPhoto,
      groupId,
    });
  }

  async leaveGroup(id: number, userId: number) {
    const where = { group: { id }, userId };
    await this.groupMembersService.deleteGroupMember(where);
    await this.memberRequestsService.deleteMemberRequest(where);
    return true;
  }
}
