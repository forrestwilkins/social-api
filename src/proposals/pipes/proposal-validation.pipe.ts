import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { ValidationError } from "apollo-server-express";
import { VotesService } from "../../votes/votes.service";
import { CreateProposalInput } from "../models/create-proposal.input";

type ProposalInput = CreateProposalInput | number;

@Injectable()
export class ProposalValidationPipe implements PipeTransform {
  constructor(private votesService: VotesService) {}

  async transform(value: ProposalInput, metadata: ArgumentMetadata) {
    const hasVotes = await this.hasVotes(value, metadata);
    if (hasVotes) {
      throw new ValidationError(
        "Proposals cannot be updated or deleted after receiving votes"
      );
    }
    return value;
  }

  async hasVotes(value: ProposalInput, { data }: ArgumentMetadata) {
    // Delete proposal
    if (typeof value === "number") {
      const votes = await this.votesService.getVotes({ proposalId: value });
      return !!votes.length;
    }
    // Update proposal
    if (data === "proposalData" && "id" in value) {
      const votes = await this.votesService.getVotes({
        proposalId: value.id as number,
      });
      return !!votes.length;
    }
    return false;
  }
}
