import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { deleteImage } from "./image.utils";
import { Image } from "./models/image.model";

export const enum ImageTypes {
  CoverPhoto = "coverPhoto",
  ProfilePicture = "profilePicture",
}

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private repository: Repository<Image>
  ) {}

  async getImage(where: FindOptionsWhere<Image>) {
    return this.repository.findOne({ where });
  }

  async getImages(where?: FindOptionsWhere<Image>) {
    return this.repository.find({ where });
  }

  async getLastImage(where?: FindOptionsWhere<Image>) {
    const image = await this.repository.find({
      order: { id: "DESC" },
      take: 1,
      where,
    });
    return image[0];
  }

  async createImage(data: Partial<Image>): Promise<Image> {
    return this.repository.save(data);
  }

  async saveImages(images: Express.Multer.File[]) {
    const savedImages: Image[] = [];

    for (const { filename } of images) {
      const image = await this.createImage({ filename });
      savedImages.push(image);
    }

    return savedImages;
  }

  async updateImage(id: number, data: Partial<Image>) {
    await this.repository.update(id, data);
    return this.getImage({ id });
  }

  async deleteImage(where: FindOptionsWhere<Image>) {
    const { filename } = await this.getImage(where);
    await deleteImage(filename);
    this.repository.delete(where);
    return true;
  }
}
