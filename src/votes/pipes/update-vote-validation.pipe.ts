import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { ValidationError } from "apollo-server-express";
import { ProposalStages } from "../../proposals/proposals.constants";
import { UpdateVoteInput } from "../models/update-vote.input";
import { VotesService } from "../votes.service";

@Injectable()
export class UpdateVoteValidationPipe implements PipeTransform {
  constructor(private votesService: VotesService) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.metatype?.name === UpdateVoteInput.name) {
      await this.validateProposalStage(value);
    }
    return value;
  }

  async validateProposalStage(value: UpdateVoteInput) {
    const vote = await this.votesService.getVote(value.id, ["proposal"]);
    if (vote.proposal.stage === ProposalStages.Ratified) {
      throw new ValidationError(
        "Proposal has been ratified and can no longer be voted on"
      );
    }
  }
}
