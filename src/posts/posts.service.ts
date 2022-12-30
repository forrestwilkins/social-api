import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, In, Repository } from "typeorm";
import { deleteImageFile, saveImage } from "../images/image.utils";
import { ImagesService } from "../images/images.service";
import { Image } from "../images/models/image.model";
import { User } from "../users/models/user.model";
import { CreatePostInput } from "./models/create-post.input";
import { Post } from "./models/post.model";
import { UpdatePostInput } from "./models/update-post.input";

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
        new Error(`Could not load images: ${id}`)
    );
    return mappedImages;
  }

  // TODO: Handle images passed with input
  async createPost(user: User, { images, ...postData }: CreatePostInput) {
    const post = await this.repository.save({ ...postData, userId: user.id });

    // TODO: Remove when no longer needed for testing
    console.log(images);

    if (images) {
      // TODO: Move to another service method once this is working
      for (const image of images) {
        console.log("Attempting to save image:", image);
        const filename = await saveImage(image);

        console.log("Saved image:", filename);

        const imageEntity = await this.imagesService.createImage({
          filename,
          postId: post.id,
        });

        console.log("Image entity:", imageEntity);
      }
    }

    return { post };
  }

  // TODO: Handle images passed with input
  async updatePost({ id, images, ...data }: UpdatePostInput) {
    await this.repository.update(id, data);
    const post = await this.getPost(id);

    // TODO: Remove when no longer needed for testing
    console.log(images);

    return { post };
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
