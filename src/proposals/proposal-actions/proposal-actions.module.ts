import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProposalAction } from "./models/proposal-action.model";
import { ProposalActionsService } from "./proposal-actions.service";

@Module({
  imports: [TypeOrmModule.forFeature([ProposalAction])],
  providers: [ProposalActionsService],
  exports: [ProposalActionsService],
})
export class ProposalActionsModule {}
