// TODO: Remove async keyword from resolver functions

import { UseGuards } from "@nestjs/common";
import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { Dataloaders } from "../dataloader/dataloader.service";
import { Group } from "../groups/models/group.model";
import { Image } from "../images/models/image.model";
import { User } from "../users/models/user.model";
import { CreatePostInput } from "./models/create-post.input";
import { Post } from "./models/post.model";
import { UpdatePostInput } from "./models/update-post.input";
import { PostsService } from "./posts.service";

@Resolver(() => Post)
export class PostsResolver {
  constructor(private postsService: PostsService) {}

  @Query(() => Post)
  async post(@Args("id", { type: () => Int }) id: number) {
    return this.postsService.getPost(id);
  }

  @Query(() => [Post])
  async posts() {
    return this.postsService.getPosts();
  }

  @ResolveField(() => [Image])
  async images(
    @Context() { loaders }: { loaders: Dataloaders },
    @Parent() { id }: Post
  ) {
    return loaders.postImagesLoader.load(id);
  }

  @ResolveField(() => User)
  async user(
    @Context() { loaders }: { loaders: Dataloaders },
    @Parent() { userId }: Post
  ) {
    return loaders.usersLoader.load(userId);
  }

  @ResolveField(() => Group)
  async group(
    @Context() { loaders }: { loaders: Dataloaders },
    @Parent() { groupId }: Post
  ) {
    return groupId ? loaders.groupsLoader.load(groupId) : null;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  async createPost(
    @Args("postData") postData: CreatePostInput,
    @CurrentUser() user: User
  ) {
    return this.postsService.createPost(user, postData);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  async updatePost(@Args("postData") postData: UpdatePostInput) {
    return this.postsService.updatePost(postData);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deletePost(@Args("id", { type: () => Int }) id: number) {
    return this.postsService.deletePost(id);
  }
}
