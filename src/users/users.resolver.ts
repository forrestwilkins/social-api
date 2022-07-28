import { UseGuards } from "@nestjs/common";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { User } from "./models/user.model";
import { UserInput } from "./models/user-input.model";
import { UsersService } from "./users.service";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@UseGuards(GqlAuthGuard)
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
    return this.service.getUserById(id);
  }

  @Query(() => [User])
  async users() {
    return this.service.getUsers();
  }

  @Mutation(() => User)
  async updateUser(@Args("userData") { id, ...data }: UserInput) {
    return this.service.updateUser(id, data);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args("id", { type: () => ID }) id: number) {
    return this.service.deleteUser(id);
  }
}
