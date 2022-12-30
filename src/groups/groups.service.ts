import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as fs from "fs";
import { FindOptionsWhere, In, Repository } from "typeorm";
import { randomDefaultImagePath, saveImage } from "../images/image.utils";
import { ImagesService, ImageTypes } from "../images/images.service";
import { Image } from "../images/models/image.model";
import { GroupMembersService } from "./group-members/group-members.service";
import { MemberRequestsService } from "./member-requests/member-requests.service";
import { CreateGroupInput } from "./models/create-group.input";
import { Group } from "./models/group.model";
import { UpdateGroupInput } from "./models/update-group.input";

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

  async getCoverPhotosByBatch(groupIds: number[]) {
    const coverPhotos = await this.imagesService.getImages({
      groupId: In(groupIds),
      imageType: ImageTypes.CoverPhoto,
    });
    const mappedCoverPhotos = groupIds.map(
      (id) =>
        coverPhotos.find((coverPhoto: Image) => coverPhoto.groupId === id) ||
        new Error(`Could not load cover photo for group: ${id}`)
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

  async createGroup(
    { coverPhoto, ...groupData }: CreateGroupInput,
    userId: number
  ) {
    const group = await this.repository.save(groupData);
    await this.groupMembersService.createGroupMember(group.id, userId);

    if (coverPhoto) {
      const filename = await saveImage(coverPhoto);
      await this.imagesService.createImage({
        imageType: ImageTypes.CoverPhoto,
        groupId: group.id,
        filename,
      });
    } else {
      await this.saveDefaultCoverPhoto(group.id);
    }

    return { group };
  }

  /**
   * TODO: Ensure that current cover photo isn't deleted
   * until after successfully creating new one
   */
  async updateGroup({ id, coverPhoto, ...groupData }: UpdateGroupInput) {
    await this.repository.update(id, groupData);
    const group = await this.getGroup({ id });

    if (coverPhoto) {
      await this.deleteCoverPhoto(id);
      const filename = await saveImage(coverPhoto);
      await this.imagesService.createImage({
        imageType: ImageTypes.CoverPhoto,
        groupId: id,
        filename,
      });
    }

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

  async deleteGroup(id: number) {
    await this.deleteCoverPhoto(id);
    await this.repository.delete(id);
    return true;
  }

  async deleteCoverPhoto(id: number) {
    await this.imagesService.deleteImage({
      imageType: ImageTypes.CoverPhoto,
      group: { id },
    });
  }

  async leaveGroup(id: number, userId: number) {
    const where = { group: { id }, userId };
    await this.groupMembersService.deleteGroupMember(where);
    await this.memberRequestsService.deleteMemberRequest(where);
    return true;
  }
}
