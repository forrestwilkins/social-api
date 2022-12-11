import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { Role } from "./models/role.model";
import { PermissionsService } from "./permissions/permissions.service";
import { RoleMembersService } from "./role-members/role-members.service";
import { ADMIN_ROLE_NAME, DEFAULT_ROLE_COLOR } from "./roles.constants";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private repository: Repository<Role>,
    private roleMembersService: RoleMembersService,
    private permissionsService: PermissionsService
  ) {}

  async getRole(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  async getRoles(where?: FindOptionsWhere<Role>) {
    return this.repository.find({ where });
  }

  async initializeServerAdminRole(userId: number) {
    const { id } = await this.repository.save({
      name: ADMIN_ROLE_NAME,
      color: DEFAULT_ROLE_COLOR,
    });
    await this.permissionsService.initializeServerPermissions(id, true);
    await this.roleMembersService.createRoleMember(id, userId);
  }
}
