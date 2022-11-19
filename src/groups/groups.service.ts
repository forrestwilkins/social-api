import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, In, Repository } from "typeorm";
import { ImagesService, ImageTypes } from "../images/images.service";
import { GroupMembersService } from "./group-members/group-members.service";
import { MemberRequestsService } from "./member-requests/member-requests.service";
import { GroupInput } from "./models/group-input.model";
import { Group } from "./models/group.model";

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private repository: Repository<Group>,
    @Inject(forwardRef(() => MemberRequestsService))
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

  async leaveGroup(id: number, userId: number) {
    const where = { group: { id }, userId };
    await this.groupMembersService.deleteGroupMember(where);
    await this.memberRequestsService.deleteMemberRequest(where);
    return true;
  }
}
