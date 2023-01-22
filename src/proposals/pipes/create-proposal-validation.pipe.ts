import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { ValidationError } from "apollo-server-express";
import { CreateProposalInput } from "../models/create-proposal.input";
import { ProposalActionInput } from "../proposal-actions/models/proposal-action.input";
import { ProposalActionTypes } from "../proposals.constants";

@Injectable()
export class CreateProposalValidationPipe implements PipeTransform {
  async transform(value: CreateProposalInput, metadata: ArgumentMetadata) {
    if (metadata.metatype?.name === CreateProposalInput.name) {
      await this.validateProposalAction(value.action);
    }
    return value;
  }

  async validateProposalAction(action: ProposalActionInput) {
    const { actionType, groupCoverPhoto, groupDescription, groupName } = action;

    if (actionType === ProposalActionTypes.ChangeName && !groupName) {
      throw new ValidationError(
        "Proposals to change group name must include a name field"
      );
    }
    if (
      actionType === ProposalActionTypes.ChangeDescription &&
      !groupDescription
    ) {
      throw new ValidationError(
        "Proposals to change group description must include a description field"
      );
    }
    if (
      actionType === ProposalActionTypes.ChangeCoverPhoto &&
      !groupCoverPhoto
    ) {
      throw new ValidationError(
        "Proposals to change group cover photo must include a cover photo"
      );
    }
  }
}
