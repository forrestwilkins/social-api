import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, In, Repository } from "typeorm";
import { deleteImageFile } from "../images/image.utils";
import { ImagesService } from "../images/images.service";
import { Image } from "../images/models/image.model";
import { User } from "../users/models/user.model";
import { PostInput } from "./models/post-input.model";
import { Post } from "./models/post.model";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private repository: Repository<Post>,
    private imagesService: ImagesService
  ) {}

  async getPost(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  async getPosts(where?: FindOptionsWhere<Post>) {
    return this.repository.find({ where, order: { createdAt: "DESC" } });
  }

  async getPostImagesByBatch(postIds: number[]) {
    const images = await this.imagesService.getImages({
      postId: In(postIds),
    });
    const mappedImages = postIds.map(
      (id) =>
        images.filter((image: Image) => image.postId === id) ||
        new Error(`Could not load image: ${id}`)
    );
    return mappedImages;
  }

  async createPost(user: User, postData: PostInput): Promise<Post> {
    const post = await this.repository.save({ ...postData, userId: user.id });
    return { ...post, user };
  }

  async updatePost(id: number, data: PostInput) {
    await this.repository.update(id, data);
    return this.getPost(id);
  }

  async savePostImages(postId: number, images: Express.Multer.File[]) {
    const savedImages: Image[] = [];
    for (const { filename } of images) {
      const image = await this.imagesService.createImage({ filename, postId });
      savedImages.push(image);
    }
    return savedImages;
  }

  async deletePost(postId: number) {
    const images = await this.imagesService.getImages({ postId });
    for (const { filename } of images) {
      await deleteImageFile(filename);
    }
    await this.repository.delete(postId);
    return true;
  }
}
