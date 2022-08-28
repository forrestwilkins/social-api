import { UseGuards } from "@nestjs/common";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { User } from "./models/user.model";
import { UserInput } from "./models/user-input.model";
import { UsersService } from "./users.service";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Image } from "../images/models/image.model";

@Resolver((_of: User) => User)
export class UsersResolver {
  constructor(private service: UsersService) {}

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  me(@CurrentUser() user: User) {
    return user;
  }

  @Query(() => User)
  async user(@Args("id", { type: () => ID }) id: number) {
    return this.service.getUserWithoutPassword({ id });
  }

  @Query(() => User)
  async userByName(@Args("name", { type: () => String }) name: string) {
    return this.service.getUserWithoutPassword({ name });
  }

  @Query(() => Image)
  async profilePicture(@Args("id", { type: () => ID }) id: number) {
    return this.service.getProfilePicture(id);
  }

  @Query(() => Image)
  @UseGuards(GqlAuthGuard)
  async myProfilePicture(@CurrentUser() user: User) {
    return this.service.getProfilePicture(user.id);
  }

  @Query(() => [User])
  async users() {
    return this.service.getUsers();
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async updateUser(@Args("userData") { id, ...data }: UserInput) {
    return this.service.updateUser(id, data);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteUser(@Args("id", { type: () => ID }) id: number) {
    return this.service.deleteUser(id);
  }
}
