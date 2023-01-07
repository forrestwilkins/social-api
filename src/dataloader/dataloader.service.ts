/**
 * TODO: Determine whether data loaders should be renamed to more
 * clearly indicate whether IDs are being mapped to one or many
 *
 * TODO: Organize data loaders and types below by entity
 */

import { Injectable } from "@nestjs/common";
import * as DataLoader from "dataloader";
import { GroupMembersService } from "../groups/group-members/group-members.service";
import { GroupMember } from "../groups/group-members/models/group-member.model";
import { GroupsService } from "../groups/groups.service";
import { MemberRequestsService } from "../groups/member-requests/member-requests.service";
import { Group } from "../groups/models/group.model";
import { Image } from "../images/models/image.model";
import { PostsService } from "../posts/posts.service";
import { ProposalsService } from "../proposals/proposals.service";
import { RoleMembersService } from "../roles/role-members/role-members.service";
import { User } from "../users/models/user.model";
import { UsersService } from "../users/users.service";
import { Vote } from "../votes/models/vote.model";
import { VoteTypes } from "../votes/votes.constants";
import { VotesService } from "../votes/votes.service";

export interface Dataloaders {
  groupCoverPhotosLoader: DataLoader<number, Image>;
  groupMemberCountLoader: DataLoader<number, number>;
  groupMembersLoader: DataLoader<number, GroupMember[]>;
  groupsLoader: DataLoader<number, Group>;
  memberRequestCountLoader: DataLoader<number, number>;
  postImagesLoader: DataLoader<number, Image[]>;
  profilePicturesLoader: DataLoader<number, Image>;
  proposalAgreementsLoader: DataLoader<number, Vote[]>;
  proposalBlocksLoader: DataLoader<number, Vote[]>;
  proposalImagesLoader: DataLoader<number, Image[]>;
  proposalReservationsLoader: DataLoader<number, Vote[]>;
  proposalStandAsidesLoader: DataLoader<number, Vote[]>;
  proposalVoteCountLoader: DataLoader<number, number>;
  proposalVotesLoader: DataLoader<number, Vote[]>;
  roleMemberCountLoader: DataLoader<number, number>;
  usersLoader: DataLoader<number, User>;
}

@Injectable()
export class DataloaderService {
  constructor(
    private groupMembersService: GroupMembersService,
    private groupsService: GroupsService,
    private memberRequestsService: MemberRequestsService,
    private postsService: PostsService,
    private proposalsService: ProposalsService,
    private roleMembersService: RoleMembersService,
    private usersService: UsersService,
    private votesService: VotesService
  ) {}

  getLoaders(): Dataloaders {
    return {
      groupCoverPhotosLoader: this._createGroupCoverPhotosLoader(),
      groupMemberCountLoader: this._createGroupMemberCountLoader(),
      groupMembersLoader: this._createGroupMembersLoader(),
      groupsLoader: this._createGroupsLoader(),
      memberRequestCountLoader: this._createMemberRequestCountLoader(),
      postImagesLoader: this._createPostImagesLoader(),
      profilePicturesLoader: this._createProfilePicturesLoader(),
      proposalAgreementsLoader: this._createProposalVotesLoader(
        VoteTypes.Agreement
      ),
      proposalBlocksLoader: this._createProposalVotesLoader(VoteTypes.Block),
      proposalImagesLoader: this._createProposalImagesLoader(),
      proposalReservationsLoader: this._createProposalVotesLoader(
        VoteTypes.Reservations
      ),
      proposalStandAsidesLoader: this._createProposalVotesLoader(
        VoteTypes.StandAside
      ),
      proposalVotesLoader: this._createProposalVotesLoader(),
      roleMemberCountLoader: this._createRoleMemberCountLoader(),
      proposalVoteCountLoader: this._createProposalVoteCountLoader(),
      usersLoader: this._createUsersLoader(),
    };
  }

  private _createUsersLoader() {
    return new DataLoader<number, User>(async (userIds) =>
      this.usersService.getUsersByBatch(userIds as number[])
    );
  }

  private _createProfilePicturesLoader() {
    return new DataLoader<number, Image>(async (userIds) =>
      this.usersService.getProfilePicturesByBatch(userIds as number[])
    );
  }

  private _createPostImagesLoader() {
    return new DataLoader<number, Image[]>(async (postIds) =>
      this.postsService.getPostImagesByBatch(postIds as number[])
    );
  }

  private _createProposalVotesLoader(voteType?: string) {
    return new DataLoader<number, Vote[]>(async (proposalIds) =>
      this.proposalsService.getProposalVotesByBatch(
        proposalIds as number[],
        voteType
      )
    );
  }

  private _createProposalVoteCountLoader() {
    return new DataLoader<number, number>(async (proposalIds) =>
      this.votesService.getVoteCountByBatch(proposalIds as number[])
    );
  }

  private _createProposalImagesLoader() {
    return new DataLoader<number, Image[]>(async (proposalIds) =>
      this.proposalsService.getProposalImagesByBatch(proposalIds as number[])
    );
  }

  private _createGroupsLoader() {
    return new DataLoader<number, Group>(async (groupIds) =>
      this.groupsService.getGroupsByBatch(groupIds as number[])
    );
  }

  private _createGroupCoverPhotosLoader() {
    return new DataLoader<number, Image>(async (groupIds) =>
      this.groupsService.getCoverPhotosByBatch(groupIds as number[])
    );
  }

  private _createMemberRequestCountLoader() {
    return new DataLoader<number, number>(async (groupIds) =>
      this.memberRequestsService.getMemberRequestCountByBatch(
        groupIds as number[]
      )
    );
  }

  private _createGroupMemberCountLoader() {
    return new DataLoader<number, number>(async (groupIds) =>
      this.groupMembersService.getGroupMemberCountByBatch(groupIds as number[])
    );
  }

  private _createGroupMembersLoader() {
    return new DataLoader<number, GroupMember[]>(async (groupIds) =>
      this.groupMembersService.getGroupMembersByBatch(groupIds as number[])
    );
  }

  private _createRoleMemberCountLoader() {
    return new DataLoader<number, number>(async (roleIds) =>
      this.roleMembersService.getRoleMemberCountByBatch(roleIds as number[])
    );
  }
}
