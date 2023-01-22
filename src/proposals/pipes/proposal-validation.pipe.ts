import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { ValidationError } from "apollo-server-express";
import { VotesService } from "../../votes/votes.service";
import { CreateProposalInput } from "../models/create-proposal.input";
import { UpdateProposalInput } from "../models/update-proposal.input";
import { ProposalActionTypes } from "../proposals.constants";
import { ProposalsService } from "../proposals.service";

type ProposalInput = CreateProposalInput | UpdateProposalInput | number;

@Injectable()
export class ProposalValidationPipe implements PipeTransform {
  constructor(
    private proposalsService: ProposalsService,
    private votesService: VotesService
  ) {}

  async transform(value: ProposalInput, { metatype }: ArgumentMetadata) {
    await this.validateProposalAction(value, metatype?.name || "");
    await this.validateVotesReceived(value, metatype?.name || "");
    return value;
  }

  async validateProposalAction(value: ProposalInput, typeName: string) {
    if (!["CreateProposalInput", "UpdateProposalInput"].includes(typeName)) {
      return;
    }
    const { action } = value as CreateProposalInput | UpdateProposalInput;
    const proposal =
      typeName === "UpdateProposalInput"
        ? await this.proposalsService.getProposal(
            (value as UpdateProposalInput).id,
            ["action.groupCoverPhoto"]
          )
        : null;

    if (
      action.actionType === ProposalActionTypes.ChangeName &&
      !proposal?.action.groupName &&
      !action.groupName
    ) {
      throw new ValidationError(
        "Proposals to change group name must include a name field"
      );
    }
    if (
      action.actionType === ProposalActionTypes.ChangeDescription &&
      !proposal?.action.groupDescription &&
      !action.groupDescription
    ) {
      throw new ValidationError(
        "Proposals to change group description must include a description field"
      );
    }
    if (
      action.actionType === ProposalActionTypes.ChangeCoverPhoto &&
      !proposal?.action.groupCoverPhoto &&
      !action.groupCoverPhoto
    ) {
      throw new ValidationError(
        "Proposals to change group cover photo must include a cover photo"
      );
    }
  }

  async validateVotesReceived(value: ProposalInput, typeName: string) {
    if (typeName === "UpdateProposalInput") {
      const votes = await this.votesService.getVotes({
        proposalId: (value as UpdateProposalInput).id,
      });
      if (votes.length) {
        throw new ValidationError(
          "Proposals cannot be updated after receiving votes"
        );
      }
    }
    if (typeof value === "number") {
      const votes = await this.votesService.getVotes({ proposalId: value });
      if (votes.length) {
        throw new ValidationError(
          "Proposals cannot be deleted after receiving votes"
        );
      }
    }
  }
}
