import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ImagesModule } from "../images/images.module";
import { VotesModule } from "../votes/votes.module";
import { Proposal } from "./models/proposal.model";
import { ProposalsResolver } from "./proposals.resolver";
import { ProposalsService } from "./proposals.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Proposal]),
    forwardRef(() => VotesModule),
    ImagesModule,
  ],
  providers: [ProposalsService, ProposalsResolver],
  exports: [ProposalsService, TypeOrmModule],
})
export class ProposalsModule {}
