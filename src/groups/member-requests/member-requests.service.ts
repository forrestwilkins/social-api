import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { GroupMembersService } from "../group-members/group-members.service";
import { Group } from "../models/group.model";
import { MemberRequestInput } from "./models/member-request-input.model";
import {
  MemberRequest,
  MemberRequestStatus,
} from "./models/member-request.model";

type GroupWithMemberRequestCount = Group & { memberRequestCount: number };

@Injectable()
export class MemberRequestsService {
  constructor(
    @InjectRepository(MemberRequest)
    private repository: Repository<MemberRequest>,
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    private groupMembersService: GroupMembersService
  ) {}

  async getMemberRequest(where?: FindOptionsWhere<MemberRequest>) {
    return this.repository.findOne({ where });
  }

  async getMemberRequests(where?: FindOptionsWhere<MemberRequest>) {
    return this.repository.find({ where, order: { createdAt: "DESC" } });
  }

  async getMemberRequestCount(groupId: number) {
    return this.repository.count({ where: { groupId } });
  }

  async getMemberRequestCountsByBatch(groupIds: number[]) {
    const groups = (await this.groupRepository
      .createQueryBuilder("group")
      .leftJoinAndSelect("group.memberRequests", "memberRequest")
      .loadRelationCountAndMap(
        "group.memberRequestCount",
        "group.memberRequests"
      )
      .select(["group.id"])
      .whereInIds(groupIds)
      .getMany()) as GroupWithMemberRequestCount[];

    const mappedMemberRequestCounts = groupIds.map((id) => {
      const group = groups.find((group: Group) => group.id === id);
      if (!group) {
        return new Error(`Could not load member request count: ${id}`);
      }
      return group.memberRequestCount;
    });

    return mappedMemberRequestCounts;
  }

  async createMemberRequest({
    groupId,
    userId,
  }: MemberRequestInput): Promise<MemberRequest> {
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
