import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { Role } from "./models/role.model";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private repository: Repository<Role>
  ) {}

  async getRole(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  async getRoles(where?: FindOptionsWhere<Role>) {
    return this.repository.find({ where });
  }
}
