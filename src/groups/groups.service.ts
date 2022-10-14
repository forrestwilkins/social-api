import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
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

  async createPost(groupData: GroupInput): Promise<Group> {
    return this.repository.save(groupData);
  }

  async saveCoverPhoto(groupId: number, { filename }: Express.Multer.File) {
    const imageData = { imageType: ImageTypes.CoverPhoto, groupId };
    await this.imagesService.deleteImage(imageData);
    return this.imagesService.createImage({
      ...imageData,
      filename,
    });
  }
}
