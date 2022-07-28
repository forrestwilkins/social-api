import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { deleteImage } from "./image.utils";
import { Image } from "./models/image.model";

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private repository: Repository<Image>
  ) {}

  async getImage(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  async getImages() {
    return this.repository.find();
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
