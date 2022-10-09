import { UseGuards } from "@nestjs/common";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { GroupsService } from "./groups.service";
import { GroupInput } from "./models/group-input.model";
import { Group } from "./models/group.model";

@Resolver(() => Group)
export class GroupsResolver {
  constructor(private groupsService: GroupsService) {}

  @Query(() => Group)
  async group(@Args("id", { type: () => ID }) id: number) {
    return this.groupsService.getGroup(id);
  }

  @Query(() => [Group])
  async groups() {
    return this.groupsService.getGroups();
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Group)
  async createGroup(@Args("groupData") groupData: GroupInput) {
    return this.groupsService.createPost(groupData);
  }
}
