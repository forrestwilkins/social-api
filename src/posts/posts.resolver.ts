import { UseGuards } from "@nestjs/common";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { Post } from "./models/post.model";
import { PostInput } from "./models/post-input.model";
import { PostsService } from "./posts.service";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "../users/models/user.model";

@Resolver((_of: Post) => Post)
export class PostsResolver {
  constructor(private service: PostsService) {}

  @Query(() => Post)
  async post(@Args("id", { type: () => ID }) id: number) {
    return this.service.getPost(id, true);
  }

  @Query(() => [Post])
  async posts() {
    return this.service.getPosts();
  }

  @Query(() => [Post])
  async postsByUserName(@Args("name") name: string) {
    return this.service.getPosts({ user: { name } });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  async createPost(
    @Args("postData") postData: PostInput,
    @CurrentUser() user: User
  ) {
    return this.service.createPost(user.id, postData);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  async updatePost(@Args("postData") { id, ...data }: PostInput) {
    return this.service.updatePost(id, data);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deletePost(@Args("id", { type: () => ID }) id: number) {
    return this.service.deletePost(id);
  }
}
