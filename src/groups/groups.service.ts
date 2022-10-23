import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, In, Repository } from "typeorm";
import { ImagesService, ImageTypes } from "../images/images.service";
import { GroupInput } from "./models/group-input.model";
import { Group } from "./models/group.model";

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private repository: Repository<Group>,
    private imagesService: ImagesService
  ) {}

  async getGroup(where: FindOptionsWhere<Group>) {
    return this.repository.findOne({ where });
  }

  async getGroups(where?: FindOptionsWhere<Group>) {
    return this.repository.find({ where, order: { createdAt: "DESC" } });
  }

  async getCoverPhoto(groupId: number) {
    return this.imagesService.getImage({
      imageType: ImageTypes.CoverPhoto,
      groupId,
    });
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

  async createGroup(groupData: GroupInput): Promise<Group> {
    return this.repository.save(groupData);
  }

  async updateGroup({ id, ...groupData }: GroupInput): Promise<Group> {
    await this.repository.update(id, groupData);
    return this.getGroup({ id });
  }

  async saveCoverPhoto(groupId: number, { filename }: Express.Multer.File) {
    await this.deleteCoverPhoto(groupId);
    return this.imagesService.createImage({
      imageType: ImageTypes.CoverPhoto,
      filename,
      groupId,
    });
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
}
