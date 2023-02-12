import { Module } from "@nestjs/common";
import { ServerInvitesResolver } from "./server-invites.resolver";
import { ServerInvitesService } from "./server-invites.service";

@Module({
  providers: [ServerInvitesResolver, ServerInvitesService],
})
export class ServerInvitesModule {}
