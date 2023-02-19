import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Dataloaders } from "../dataloader/dataloader.service";
import { User } from "../users/models/user.model";
import { CreateServerInviteInput } from "./models/create-server-invite.input";
import { CreateServerInvitePayload } from "./models/create-server-invite.payload";
import { ServerInvite } from "./models/server-invite.model";
import { ServerInvitesService } from "./server-invites.service";

@Resolver(() => ServerInvite)
export class ServerInvitesResolver {
  constructor(private serverInvitesService: ServerInvitesService) {}

  @Query(() => [ServerInvite])
  async serverInvites() {
    return this.serverInvitesService.getServerInvites();
  }

  @ResolveField(() => User)
  async user(
    @Context() { loaders }: { loaders: Dataloaders },
    @Parent() { userId }: ServerInvite
  ) {
    return loaders.usersLoader.load(userId);
  }

  @Mutation(() => CreateServerInvitePayload)
  async createServerInvite(
    @Args("serverInviteData") serverInviteData: CreateServerInviteInput,
    @CurrentUser() user: User
  ) {
    return this.serverInvitesService.createServerInvite(serverInviteData, user);
  }
}
