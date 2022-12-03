import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
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

  async getRoleMembers(where?: FindOptionsWhere<RoleMember>) {
    return this.repository.find({ where });
  }
}
