import { Injectable, PipeTransform } from "@nestjs/common";
import { ValidationError } from "apollo-server-express";
import { ProposalStages } from "../../proposals/proposals.constants";
import { ProposalsService } from "../../proposals/proposals.service";
import { CreateVoteInput } from "../models/create-vote.input";
import { UpdateVoteInput } from "../models/update-vote.input";
import { VotesService } from "../votes.service";

type VoteInput = CreateVoteInput | UpdateVoteInput | number;

@Injectable()
export class VoteValidationPipe implements PipeTransform {
  constructor(
    private proposalsService: ProposalsService,
    private votesService: VotesService
  ) {}

  async transform(value: VoteInput) {
    const isRatified = await this.isRatified(value);
    if (isRatified) {
      throw new ValidationError(
        "Proposal has been ratified and can no longer be voted on"
      );
    }
    return value;
  }

  async isRatified(value: VoteInput) {
    // Delete vote
    if (typeof value === "number") {
      const vote = await this.votesService.getVote(value, ["proposal"]);
      return vote?.proposal.stage === ProposalStages.Ratified;
    }
    // Create vote
    if ("proposalId" in value) {
      const proposal = await this.proposalsService.getProposal(
        value.proposalId
      );
      return proposal?.stage === ProposalStages.Ratified;
    }
    // Update vote
    if ("id" in value) {
      const vote = await this.votesService.getVote(value.id, ["proposal"]);
      return vote?.proposal.stage === ProposalStages.Ratified;
    }
    return false;
  }
}
