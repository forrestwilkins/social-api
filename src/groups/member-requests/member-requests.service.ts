import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { MemberRequest } from "./models/member-request.model";

@Injectable()
export class MemberRequestsService {
  constructor(
    @InjectRepository(MemberRequest)
    private repository: Repository<MemberRequest>
  ) {}

  async getMemberRequest(where?: FindOptionsWhere<MemberRequest>) {
    return this.repository.findOne({ where });
  }

  async getMemberRequests(where?: FindOptionsWhere<MemberRequest>) {
    return this.repository.find({ where, order: { createdAt: "DESC" } });
  }

  async createMemberRequest(
    groupId: number,
    userId: number
  ): Promise<MemberRequest> {
    return this.repository.save({ groupId, userId });
  }

  async deleteMemberRequest(id: number) {
    await this.repository.delete(id);
    return true;
  }
}
