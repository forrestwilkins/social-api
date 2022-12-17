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
import { Dataloaders } from "../dataloader/dataloader.service";
import { CreateRoleInput } from "./models/create-role.input";
import { CreateRolePayload } from "./models/create-role.payload";
import { Role } from "./models/role.model";
import { Permission } from "./permissions/models/permission.model";
import { PermissionsService } from "./permissions/permissions.service";
import { RoleMember } from "./role-members/models/role-member.model";
import { RoleMembersService } from "./role-members/role-members.service";
import { RolesService } from "./roles.service";

@Resolver(() => Role)
export class RolesResolver {
  constructor(
    private permissionsService: PermissionsService,
    private roleMembersService: RoleMembersService,
    private rolesService: RolesService
  ) {}

  @Query(() => Role)
  async role(@Args("id", { type: () => Int }) id: number) {
    return this.rolesService.getRole(id);
  }

  @Query(() => [Role])
  async serverRoles() {
    return this.rolesService.getServerRoles();
  }

  @ResolveField(() => [Permission])
  async permissions(@Parent() { id }: Role) {
    return this.permissionsService.getPermissions({ roleId: id });
  }

  @ResolveField(() => [RoleMember])
  async members(@Parent() { id }: Role) {
    return this.roleMembersService.getRoleMembers({ where: { roleId: id } });
  }

  @ResolveField(() => Number)
  async memberCount(
    @Parent() { id }: Role,
    @Context() { loaders }: { loaders: Dataloaders }
  ) {
    return loaders.roleMemberCountLoader.load(id);
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
