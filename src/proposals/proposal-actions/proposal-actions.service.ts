import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserInputError } from "apollo-server-express";
import { FileUpload } from "graphql-upload";
import { FindOptionsWhere, In, Repository } from "typeorm";
import { saveImage } from "../../images/image.utils";
import { ImagesService } from "../../images/images.service";
import { ProposalActionTypes } from "../proposals.constants";
import { ProposalAction } from "./models/proposal-action.model";

@Injectable()
export class ProposalActionsService {
  constructor(
    @InjectRepository(ProposalAction)
    private repository: Repository<ProposalAction>,
    private imagesService: ImagesService
  ) {}

  async getProposalAction(
    where: FindOptionsWhere<ProposalAction>,
    relations?: string[]
  ) {
    return this.repository.findOne({ where, relations });
  }

  async getProposalActions(where?: FindOptionsWhere<ProposalAction>) {
    return this.repository.find({ where });
  }

  async getProposedGroupCoverPhoto(proposalActionId: number) {
    const action = await this.getProposalAction(
      {
        id: proposalActionId,
        actionType: ProposalActionTypes.ChangeCoverPhoto,
      },
      ["groupCoverPhoto"]
    );
    if (!action) {
      throw new UserInputError("Could not find proposed group photo");
    }
    return action.groupCoverPhoto;
  }

  async getProposalActionsByBatch(proposalIds: number[]) {
    const proposalActions = await this.getProposalActions({
      proposalId: In(proposalIds),
    });
    return proposalIds.map(
      (id) =>
        proposalActions.find(
          (proposalAction: ProposalAction) => proposalAction.id === id
        ) || new Error(`Could not load proposal action: ${id}`)
    );
  }

  async saveProposalActionImage(
    proposalActionId: number,
    image: Promise<FileUpload>,
    imageType: string
  ) {
    const filename = await saveImage(image);
    await this.imagesService.createImage({
      filename,
      imageType,
      proposalActionId,
    });
  }
}
