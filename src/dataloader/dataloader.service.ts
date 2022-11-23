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
  groupCoverPhotoLoader: DataLoader<number, Image>;
  groupMemberCountLoader: DataLoader<number, number>;
  groupMembersLoader: DataLoader<number, GroupMember[]>;
  groupLoader: DataLoader<number, Group>;
  memberRequestCountLoader: DataLoader<number, number>;
  postImagesLoader: DataLoader<number, Image[]>;
  profilePictureLoader: DataLoader<number, Image>;
  userLoader: DataLoader<number, User>;
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
      groupCoverPhotoLoader: this._createGroupCoverPhotoLoader(),
      groupLoader: this._createGroupLoader(),
      groupMemberCountLoader: this._createGroupMemberCountLoader(),
      groupMembersLoader: this._createGroupMembersLoader(),
      memberRequestCountLoader: this._createMemberRequestCountLoader(),
      postImagesLoader: this._createPostImagesLoader(),
      profilePictureLoader: this._createProfilePictureLoader(),
      userLoader: this._createUserLoader(),
    };
  }

  private _createUserLoader() {
    return new DataLoader<number, User>(async (userIds) =>
      this.usersService.getUsersByBatch(userIds as number[])
    );
  }

  private _createProfilePictureLoader() {
    return new DataLoader<number, Image>(async (userIds) =>
      this.usersService.getProfilePicturesByBatch(userIds as number[])
    );
  }

  private _createPostImagesLoader() {
    return new DataLoader<number, Image[]>(async (postIds) =>
      this.postsService.getPostImagesByBatch(postIds as number[])
    );
  }

  private _createGroupLoader() {
    return new DataLoader<number, Group>(async (groupIds) =>
      this.groupsService.getGroupsByBatch(groupIds as number[])
    );
  }

  private _createGroupCoverPhotoLoader() {
    return new DataLoader<number, Image>(async (groupIds) =>
      this.groupsService.getCoverPhotosByBatch(groupIds as number[])
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
