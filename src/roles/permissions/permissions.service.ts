import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { Permission } from "./models/permission.model";
import { ServerPermissions } from "./permissions.constants";

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private repository: Repository<Permission>
  ) {}

  async getPermission(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  async getPermissions(where?: FindOptionsWhere<Permission>) {
    return this.repository.find({ where, order: { id: "ASC" } });
  }

  async initializeServerPermissions(roleId: number, enabled = false) {
    const permissions = Object.values(ServerPermissions).map((name) => ({
      enabled,
      roleId,
      name,
    }));
    const permissionEntities = this.repository.create(permissions);
    await this.repository.insert(permissionEntities);
  }
}
