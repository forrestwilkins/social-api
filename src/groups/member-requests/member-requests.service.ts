import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { GroupMembersService } from "../group-members/group-members.service";
import { MemberRequestInput } from "./models/member-request-input.model";
import {
  MemberRequest,
  MemberRequestStatus,
} from "./models/member-request.model";

@Injectable()
export class MemberRequestsService {
  constructor(
    @InjectRepository(MemberRequest)
    private repository: Repository<MemberRequest>,
    private groupMembersService: GroupMembersService
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

  async approveMemberRequest(
    id: number,
    memberRequestData: MemberRequestInput
  ): Promise<MemberRequest> {
    const memberRequest = await this.updateMemberRequest(id, {
      ...memberRequestData,
      status: MemberRequestStatus.Approved,
    });
    await this.groupMembersService.createGroupMember(
      memberRequestData.groupId,
      memberRequestData.userId
    );
    return memberRequest;
  }

  async denyMemberRequest(
    id: number,
    memberRequestData: MemberRequestInput
  ): Promise<MemberRequest> {
    return this.updateMemberRequest(id, {
      ...memberRequestData,
      status: MemberRequestStatus.Denied,
    });
  }

  async updateMemberRequest(
    id: number,
    memberRequestData: Partial<MemberRequest>
  ): Promise<MemberRequest> {
    await this.repository.update(id, memberRequestData);
    return this.getMemberRequest({ id });
  }

  async deleteMemberRequest(id: number) {
    await this.repository.delete(id);
    return true;
  }
}
