import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProposalAction } from "./models/proposal-action.model";
import { ProposalActionsResolver } from "./proposal-actions.resolver";
import { ProposalActionsService } from "./proposal-actions.service";

@Module({
  imports: [TypeOrmModule.forFeature([ProposalAction])],
  providers: [ProposalActionsService, ProposalActionsResolver],
  exports: [ProposalActionsService],
})
export class ProposalActionsModule {}
