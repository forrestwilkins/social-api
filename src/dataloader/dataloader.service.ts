/**
 * TODO: Determine whether data loaders should be renamed to more
 * clearly indicate whether IDs are being mapped to one or many
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
import { User } from "../users/models/user.model";
import { UsersService } from "../users/users.service";

export interface Dataloaders {
  groupMemberCountLoader: DataLoader<number, number>;
  groupMembersLoader: DataLoader<number, GroupMember[]>;
  groupsLoader: DataLoader<number, Group>;
  memberRequestCountLoader: DataLoader<number, number>;
  postImagesLoader: DataLoader<number, Image[]>;
  profilePicturesLoader: DataLoader<number, Image>;
  usersLoader: DataLoader<number, User>;
}

@Injectable()
export class DataloaderService {
  constructor(
    private groupMembersService: GroupMembersService,
    private groupsService: GroupsService,
    private memberRequestsService: MemberRequestsService,
    private postsService: PostsService,
    private usersService: UsersService
  ) {}

  getLoaders(): Dataloaders {
    return {
      groupMemberCountLoader: this._createGroupMemberCountLoader(),
      groupMembersLoader: this._createGroupMembersLoader(),
      groupsLoader: this._createGroupsLoader(),
      memberRequestCountLoader: this._createMemberRequestCountLoader(),
      postImagesLoader: this._createPostImagesLoader(),
      profilePicturesLoader: this._createProfilePicturesLoader(),
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

  private _createGroupsLoader() {
    return new DataLoader<number, Group>(async (groupIds) =>
      this.groupsService.getGroupsByBatch(groupIds as number[])
    );
  }

  private _createMemberRequestCountLoader() {
    return new DataLoader<number, number>(async (groupIds) =>
      this.memberRequestsService.getMemberRequestCountsByBatch(
        groupIds as number[]
      )
    );
  }

  private _createGroupMemberCountLoader() {
    return new DataLoader<number, number>(async (groupIds) =>
      this.groupMembersService.getGroupMemberCountsByBatch(groupIds as number[])
    );
  }

  private _createGroupMembersLoader() {
    return new DataLoader<number, GroupMember[]>(async (groupIds) =>
      this.groupMembersService.getGroupMembersByBatch(groupIds as number[])
    );
  }
}
