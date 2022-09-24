import { UseGuards } from "@nestjs/common";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { UserInput } from "./models/user-input.model";
import { User } from "./models/user.model";
import { UsersService } from "./users.service";

@Resolver((_of: User) => User)
export class UsersResolver {
  constructor(private service: UsersService) {}

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  me(@CurrentUser() { id }: User) {
    return this.service.getUserProfile({ id }, true);
  }

  @Query(() => User)
  async user(@Args("id", { type: () => ID }) id: number) {
    return this.service.getUserProfile({ id }, true);
  }

  @Query(() => User)
  async userProfile(@Args("name", { type: () => String }) name: string) {
    return this.service.getUserProfile({ name });
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
