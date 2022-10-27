import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { GroupMember } from "./models/group-member.model";

@Injectable()
export class GroupMembersService {
  constructor(
    @InjectRepository(GroupMember)
    private repository: Repository<GroupMember>
  ) {}

  async getGroupMembers(where?: FindOptionsWhere<GroupMember>) {
    return this.repository.find({ where, order: { createdAt: "DESC" } });
  }

  async createGroupMember(
    groupId: number,
    userId: number
  ): Promise<GroupMember> {
    return this.repository.save({ groupId, userId });
  }
}
