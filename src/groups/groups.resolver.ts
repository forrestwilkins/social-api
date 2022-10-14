import { UseGuards } from "@nestjs/common";
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { GroupsService } from "./groups.service";
import { GroupInput } from "./models/group-input.model";
import { Group } from "./models/group.model";

@Resolver(() => Group)
export class GroupsResolver {
  constructor(private groupsService: GroupsService) {}

  @Query(() => Group)
  async group(@Args("name", { type: () => String }) name: string) {
    return this.groupsService.getGroup({ name });
  }

  @Query(() => [Group])
  async groups() {
    return this.groupsService.getGroups();
  }

  @ResolveField(() => Image)
  async coverPhoto(@Parent() { id }: Group) {
    return this.groupsService.getCoverPhoto(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Group)
  async createGroup(@Args("groupData") groupData: GroupInput) {
    return this.groupsService.createPost(groupData);
  }
}
