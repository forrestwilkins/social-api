import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, Repository } from "typeorm";
import { RoleMember } from "./models/role-member.model";

@Injectable()
export class RoleMembersService {
  constructor(
    @InjectRepository(RoleMember)
    private repository: Repository<RoleMember>
  ) {}

  async getRoleMember(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  async getRoleMembers(options?: FindManyOptions<RoleMember>) {
    return this.repository.find(options);
  }

  async createRoleMember(roleId: number, userId: number) {
    return this.repository.save({ roleId, userId });
  }
}
