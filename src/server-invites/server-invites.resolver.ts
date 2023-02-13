import { Query, Resolver } from "@nestjs/graphql";
import { ServerInvite } from "./models/server-invite.model";
import { ServerInvitesService } from "./server-invites.service";

@Resolver(() => ServerInvite)
export class ServerInvitesResolver {
  constructor(private serverInvitesService: ServerInvitesService) {}

  @Query(() => [ServerInvite])
  async serverInvites() {
    return this.serverInvitesService.getServerInvites();
  }
}
