import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { CreateRoleInput } from "./models/create-role.input";
import { CreateRolePayload } from "./models/create-role.payload";
import { Role } from "./models/role.model";
import { Permission } from "./permissions/models/permission.model";
import { PermissionsService } from "./permissions/permissions.service";
import { RolesService } from "./roles.service";

@Resolver(() => Role)
export class RolesResolver {
  constructor(
    private rolesService: RolesService,
    private permissionsService: PermissionsService
  ) {}

  @Query(() => Role)
  async role(@Args("id", { type: () => Int }) id: number) {
    return this.rolesService.getRole(id);
  }

  @Query(() => [Role])
  async serverRoles() {
    return this.rolesService.getServerRoles();
  }

  @ResolveField(() => Permission)
  async permissions(@Parent() { id }: Role) {
    return this.permissionsService.getPermissions({ roleId: id });
  }

  @Mutation(() => CreateRolePayload)
  async createRole(@Args("roleData") roleData: CreateRoleInput) {
    return this.rolesService.createRole(roleData);
  }

  @Mutation(() => Boolean)
  async deleteRole(@Args("id", { type: () => Int }) id: number) {
    return this.rolesService.deleteRole(id);
  }
}
