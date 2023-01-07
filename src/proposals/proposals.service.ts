import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FileUpload } from "graphql-upload";
import { FindOptionsWhere, In, Repository } from "typeorm";
import { deleteImageFile, saveImage } from "../images/image.utils";
import { ImagesService } from "../images/images.service";
import { Image } from "../images/models/image.model";
import { User } from "../users/models/user.model";
import { Vote } from "../votes/models/vote.model";
import { VotesService } from "../votes/votes.service";
import { CreateProposalInput } from "./models/create-proposal.input";
import { Proposal } from "./models/proposal.model";

@Injectable()
export class ProposalsService {
  constructor(
    @InjectRepository(Proposal)
    private repository: Repository<Proposal>,
    private imagesService: ImagesService,
    private votesService: VotesService
  ) {}

  async getProposal(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  async getProposals(where?: FindOptionsWhere<Proposal>) {
    return this.repository.find({ where });
  }

  async getProposalVotesByBatch(proposalIds: number[], voteType?: string) {
    const votes = await this.votesService.getVotes({
      proposalId: In(proposalIds),
      voteType,
    });
    const mappedVotes = proposalIds.map(
      (id) =>
        votes.filter((vote: Vote) => vote.proposalId === id) ||
        new Error(`Could not load votes for proposal: ${id}`)
    );
    return mappedVotes;
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
    { images, ...proposalData }: CreateProposalInput,
    user: User
  ) {
    const proposal = await this.repository.save({
      ...proposalData,
      userId: user.id,
    });
    if (images) {
      try {
        await this.saveProposalImages(proposal.id, images);
      } catch (err) {
        await this.deleteProposal(proposal.id);
        throw new Error(err.message);
      }
    }
    return { proposal };
  }

  async saveProposalImages(proposalId: number, images: Promise<FileUpload>[]) {
    for (const image of images) {
      const filename = await saveImage(image);
      await this.imagesService.createImage({ filename, proposalId });
    }
  }

  async deleteProposal(proposalId: number) {
    const images = await this.imagesService.getImages({ proposalId });
    for (const { filename } of images) {
      await deleteImageFile(filename);
    }
    await this.repository.delete(proposalId);
    return true;
  }
}
