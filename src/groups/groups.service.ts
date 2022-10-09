import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { Group } from "./group.model";

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private repository: Repository<Group>
  ) {}

  async getGroup(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  async getGroups(where?: FindOptionsWhere<Group>) {
    return this.repository.find({ where, order: { createdAt: "DESC" } });
  }
}
