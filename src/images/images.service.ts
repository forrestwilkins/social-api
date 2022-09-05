import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Stream } from "stream";
import { FindOptionsWhere, Repository } from "typeorm";
import { deleteImage } from "./image.utils";
import { Image } from "./models/image.model";

export const enum ImageTypes {
  CoverPhoto = "coverPhoto",
  ProfilePicture = "profilePicture",
}

export interface FileUpload {
  createReadStream: () => Stream;
  encoding: string;
  filename: string;
  mimetype: string;
}

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private repository: Repository<Image>
  ) {}

  async getImage(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  async getImages(where?: FindOptionsWhere<Image>) {
    return this.repository.find({ where });
  }

  async createImage(data: Partial<Image>) {
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

  async deleteImage(imageId: number) {
    const { filename } = await this.getImage(imageId);
    await deleteImage(filename);
    this.repository.delete(imageId);
    return true;
  }
}
