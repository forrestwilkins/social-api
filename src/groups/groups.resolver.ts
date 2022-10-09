import { Args, ID, Query, Resolver } from "@nestjs/graphql";
import { Group } from "./group.model";
import { GroupsService } from "./groups.service";

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
}
