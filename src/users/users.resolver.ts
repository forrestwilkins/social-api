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
import { Dataloaders } from "../dataloader/dataloader.service";
import { Image } from "../images/models/image.model";
import { Post } from "../posts/models/post.model";
import { PostsService } from "../posts/posts.service";
import { UserInput } from "./models/user-input.model";
import { User } from "./models/user.model";
import { UsersService } from "./users.service";

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private postsService: PostsService,
    private usersService: UsersService
  ) {}

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  me(@CurrentUser() { id }: User) {
    return this.usersService.getUser({ id });
  }

  @Query(() => User)
  async user(
    @Args("id", { type: () => ID, nullable: true }) id?: number,
    @Args("name", { type: () => String, nullable: true }) name?: string
  ) {
    return this.usersService.getUser({ id, name });
  }

  @Query(() => [User])
  async users() {
    return this.usersService.getUsers();
  }

  @ResolveField(() => [Post])
  async posts(@Parent() { id }: User) {
    return this.postsService.getPosts({ userId: id });
  }

  @ResolveField(() => Image)
  async profilePicture(
    @Context() { loaders }: { loaders: Dataloaders },
    @Parent() { id }: User
  ) {
    return loaders.profilePicturesLoader.load(id);
  }

  @ResolveField(() => Image)
  async coverPhoto(@Parent() { id }: User) {
    return this.usersService.getCoverPhoto(id);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async updateUser(@Args("userData") { id, ...data }: UserInput) {
    return this.usersService.updateUser(id, data);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteUser(@Args("id", { type: () => ID }) id: number) {
    return this.usersService.deleteUser(id);
  }
}
