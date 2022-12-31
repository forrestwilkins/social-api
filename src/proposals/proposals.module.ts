import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Proposal } from "./models/proposal.model";
import { ProposalsResolver } from "./proposals.resolver";
import { ProposalsService } from "./proposals.service";

@Module({
  imports: [TypeOrmModule.forFeature([Proposal])],
  providers: [ProposalsService, ProposalsResolver],
})
export class ProposalsModule {}
