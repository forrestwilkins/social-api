import { UseGuards } from "@nestjs/common";
import {
  Args,
  ID,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from "@nestjs/graphql";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { ImagesService } from "../images/images.service";
import { Image } from "../images/models/image.model";
import { User } from "../users/models/user.model";
import { PostInput } from "./models/post-input.model";
import { Post } from "./models/post.model";
import { PostsService } from "./posts.service";

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private imagesService: ImagesService,
    private postsService: PostsService
  ) {}

  @Query(() => Post)
  async post(@Args("id", { type: () => ID }) id: number) {
    return this.postsService.getPost(id);
  }

  @Query(() => [Post])
  async posts() {
    return this.postsService.getPosts();
  }

  @ResolveField(() => [Image])
  async images(@Root() { id }: Post) {
    return this.imagesService.getImages({ postId: id });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  async createPost(
    @Args("postData") postData: PostInput,
    @CurrentUser() user: User
  ) {
    return this.postsService.createPost(user.id, postData);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  async updatePost(@Args("postData") { id, ...data }: PostInput) {
    return this.postsService.updatePost(id, data);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deletePost(@Args("id", { type: () => ID }) id: number) {
    return this.postsService.deletePost(id);
  }
}
