import { Module } from "@nestjs/common";
import { ProposalsResolver } from "./proposals.resolver";
import { ProposalsService } from "./proposals.service";

@Module({
  providers: [ProposalsService, ProposalsResolver],
})
export class ProposalsModule {}
