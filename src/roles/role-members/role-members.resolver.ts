import { Context, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { Dataloaders } from "../../dataloader/dataloader.service";
import { User } from "../../users/models/user.model";
import { RoleMember } from "./models/role-member.model";

@Resolver(() => RoleMember)
export class RoleMembersResolver {
  @ResolveField(() => User)
  async user(
    @Context() { loaders }: { loaders: Dataloaders },
    @Parent() { userId }: RoleMember
  ) {
    return loaders.usersLoader.load(userId);
  }
}
