import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ImagesModule } from "../../images/images.module";
import { ProposalAction } from "./models/proposal-action.model";
import { ProposalActionsService } from "./proposal-actions.service";
import { ProposalActionsResolver } from "./proposal-actions.resolver";

@Module({
  imports: [TypeOrmModule.forFeature([ProposalAction]), ImagesModule],
  providers: [ProposalActionsService, ProposalActionsResolver],
  exports: [ProposalActionsService],
})
export class ProposalActionsModule {}
