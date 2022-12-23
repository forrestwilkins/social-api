import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { Dataloaders } from "../../dataloader/dataloader.service";
import { User } from "../../users/models/user.model";
import { RoleMember } from "./models/role-member.model";
import { RoleMembersService } from "./role-members.service";

@Resolver(() => RoleMember)
export class RoleMembersResolver {
  constructor(private roleMembersService: RoleMembersService) {}

  @ResolveField(() => User)
  async user(
    @Context() { loaders }: { loaders: Dataloaders },
    @Parent() { userId }: RoleMember
  ) {
    return loaders.usersLoader.load(userId);
  }

  @Mutation(() => Boolean)
  async deleteRoleMember(@Args("id", { type: () => Int }) id: number) {
    return this.roleMembersService.deleteRoleMember(id);
  }
}
