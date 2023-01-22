import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { ValidationError } from "apollo-server-express";
import { VotesService } from "../../votes/votes.service";
import { CreateProposalInput } from "../models/create-proposal.input";
import { UpdateProposalInput } from "../models/update-proposal.input";
import { ProposalActionTypes } from "../proposals.constants";

type ProposalInput = CreateProposalInput | UpdateProposalInput | number;

@Injectable()
export class ProposalValidationPipe implements PipeTransform {
  constructor(private votesService: VotesService) {}

  async transform(value: ProposalInput, metadata: ArgumentMetadata) {
    await this.validateProposalAction(value, metadata);
    const hasVotes = await this.hasVotes(value, metadata);
    if (hasVotes) {
      throw new ValidationError(
        "Proposals cannot be updated or deleted after receiving votes"
      );
    }
    return value;
  }

  async validateProposalAction(
    value: ProposalInput,
    { metatype }: ArgumentMetadata
  ) {
    if (
      ["CreateProposalInput", "UpdateProposalInput"].includes(
        metatype?.name || ""
      )
    ) {
      const { action } = value as CreateProposalInput | UpdateProposalInput;

      if (
        action.actionType === ProposalActionTypes.ChangeName &&
        !action.groupName
      ) {
        throw new ValidationError(
          "Proposals to change group name must include a name field"
        );
      }

      if (
        action.actionType === ProposalActionTypes.ChangeDescription &&
        !action.groupDescription
      ) {
        throw new ValidationError(
          "Proposals to change group description must include a description field"
        );
      }

      if (
        action.actionType === ProposalActionTypes.ChangeCoverPhoto &&
        !action.groupCoverPhoto
      ) {
        throw new ValidationError(
          "Proposals to change group cover photo must include a cover photo"
        );
      }
    }
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
        proposalId: value.id,
      });
      return !!votes.length;
    }
    return false;
  }
}
