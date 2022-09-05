import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { deleteImage } from "../images/image.utils";
import { ImagesService } from "../images/images.service";
import { Image } from "../images/models/image.model";
import { PostInput } from "./models/post-input.model";
import { Post } from "./models/post.model";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private repository: Repository<Post>,
    private imagesService: ImagesService
  ) {}

  async getPost(id: number, withImages?: boolean) {
    return this.repository.findOne({
      where: { id },
      relations: withImages ? ["images"] : [],
    });
  }

  async getPosts(where?: FindOptionsWhere<Post>) {
    const posts = await this.repository.find({
      relations: ["images"],
      where,
    });
    return posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createPost(userId: number, { images, ...rest }: PostInput) {
    console.log(images);
    return this.repository.save({ ...rest, userId });
  }

  async updatePost(postId: number, { images, ...rest }: PostInput) {
    console.log(images);
    await this.repository.update(postId, rest);
    return this.getPost(postId);
  }

  async savePostImages(postId: number, images: Express.Multer.File[]) {
    const savedImages: Image[] = [];

    for (const { filename } of images) {
      const image = await this.imagesService.createImage({
        filename,
        postId,
      });
      savedImages.push(image);
    }

    return savedImages;
  }

  async deletePost(postId: number) {
    const { images } = await this.getPost(postId, true);
    for (const { filename } of images) {
      await deleteImage(filename);
    }
    this.repository.delete(postId);
    return true;
  }
}
