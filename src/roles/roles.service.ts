import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, In, IsNull, Not, Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { CreateRoleInput } from "./models/create-role.input";
import { Role } from "./models/role.model";
import { UpdateRoleInput } from "./models/update-role.input";
import { PermissionsService } from "./permissions/permissions.service";
import { RoleMembersService } from "./role-members/role-members.service";
import { ADMIN_ROLE_NAME, DEFAULT_ROLE_COLOR } from "./roles.constants";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private repository: Repository<Role>,

    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,

    private roleMembersService: RoleMembersService,
    private permissionsService: PermissionsService
  ) {}

  async getRole(id: number, relations?: string[]) {
    return this.repository.findOne({ where: { id }, relations });
  }

  async getRoles(where?: FindOptionsWhere<Role>) {
    return this.repository.find({ where, order: { updatedAt: "DESC" } });
  }

  async getServerRoles() {
    return this.getRoles({ groupId: IsNull() });
  }

  async getAvailableUsersToAdd(id: number) {
    const role = await this.getRole(id, ["members"]);
    if (!role?.members) {
      return [];
    }

    const userIds = role.members.reduce<number[]>((result, { userId }) => {
      result.push(userId);
      return result;
    }, []);

    return this.usersService.getUsers({
      id: Not(In(userIds)),
    });
  }

  async initializeServerAdminRole(userId: number) {
    const { id } = await this.repository.save({
      name: ADMIN_ROLE_NAME,
      color: DEFAULT_ROLE_COLOR,
    });
    await this.permissionsService.initializeServerPermissions(id, true);
    await this.roleMembersService.createRoleMember(id, userId);
  }

  async createRole(roleData: CreateRoleInput) {
    const role = await this.repository.save(roleData);
    return { role };
  }

  async updateRole({ id, selectedUserIds, ...data }: UpdateRoleInput) {
    await this.repository.update(id, data);

    if (selectedUserIds?.length) {
      await this.roleMembersService.addRoleMembers(id, selectedUserIds);
    }
    const role = await this.getRole(id);
    return { role };
  }

  async deleteRole(id: number) {
    await this.repository.delete(id);
    return true;
  }
}
