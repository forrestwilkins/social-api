import { UseGuards } from "@nestjs/common";
import {
  Args,
  Context,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { Dataloaders } from "../dataloader/dataloader.interface";
import { Image } from "../images/models/image.model";
import { User } from "../users/models/user.model";
import { PostInput } from "./models/post-input.model";
import { Post } from "./models/post.model";
import { PostsService } from "./posts.service";

@Resolver(() => Post)
export class PostsResolver {
  constructor(private postsService: PostsService) {}

  @Query(() => Post)
  async post(@Args("id", { type: () => ID }) id: number) {
    return this.postsService.getPost(id);
  }

  @Query(() => [Post])
  async posts() {
    return this.postsService.getPosts();
  }

  @ResolveField(() => User)
  async user(
    @Context() { loaders }: { loaders: Dataloaders },
    @Parent() { userId }: Post
  ) {
    return loaders.usersLoader.load(userId);
  }

  @ResolveField(() => [Image])
  async images(
    @Context() { loaders }: { loaders: Dataloaders },
    @Parent() { id }: Post
  ) {
    return loaders.postImagesLoader.load(id);
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
