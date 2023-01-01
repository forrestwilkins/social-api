import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, In, Repository } from "typeorm";
import { ImagesService } from "../images/images.service";
import { Image } from "../images/models/image.model";
import { User } from "../users/models/user.model";
import { CreateProposalInput } from "./models/create-proposal.input";
import { Proposal } from "./models/proposal.model";

@Injectable()
export class ProposalsService {
  constructor(
    @InjectRepository(Proposal)
    private repository: Repository<Proposal>,
    private imagesService: ImagesService
  ) {}

  async getProposal(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  async getProposals(where?: FindOptionsWhere<Proposal>) {
    return this.repository.find({ where });
  }

  async getProposalImagesByBatch(proposalIds: number[]) {
    const images = await this.imagesService.getImages({
      proposalId: In(proposalIds),
    });
    const mappedImages = proposalIds.map(
      (id) =>
        images.filter((image: Image) => image.proposalId === id) ||
        new Error(`Could not load images for proposal: ${id}`)
    );
    return mappedImages;
  }

  async createProposal(
    user: User,
    { images, ...proposalData }: CreateProposalInput
  ) {
    const proposal = await this.repository.save({
      ...proposalData,
      userId: user.id,
    });

    // TODO: Remove when no longer needed for testing
    console.log(images);

    return { proposal };
  }
}
