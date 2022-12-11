import { Args, Int, Query, Resolver } from "@nestjs/graphql";
import { Role } from "./models/role.model";
import { RolesService } from "./roles.service";

@Resolver(() => Role)
export class RolesResolver {
  constructor(private rolesService: RolesService) {}

  @Query(() => Role)
  async role(@Args("id", { type: () => Int }) id: number) {
    return this.rolesService.getRole(id);
  }

  @Query(() => [Role])
  async serverRoles() {
    return this.rolesService.getServerRoles();
  }
}
