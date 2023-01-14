import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FileUpload } from "graphql-upload";
import { FindOptionsWhere, In, Repository } from "typeorm";
import { GroupMember } from "../groups/group-members/models/group-member.model";
import { DefaultGroupSettings } from "../groups/groups.constants";
import { deleteImageFile, saveImage } from "../images/image.utils";
import { ImagesService } from "../images/images.service";
import { Image } from "../images/models/image.model";
import { User } from "../users/models/user.model";
import { Vote } from "../votes/models/vote.model";
import { VotesService } from "../votes/votes.service";
import { sortConsensusVotesByType } from "../votes/votes.utils";
import { CreateProposalInput } from "./models/create-proposal.input";
import { Proposal } from "./models/proposal.model";
import { UpdateProposalInput } from "./models/update-proposal.input";
import {
  MIN_GROUP_SIZE_TO_RATIFY,
  MIN_VOTE_COUNT_TO_RATIFY,
  ProposalStages,
} from "./proposals.constants";

@Injectable()
export class ProposalsService {
  constructor(
    @InjectRepository(Proposal)
    private repository: Repository<Proposal>,

    @Inject(forwardRef(() => VotesService))
    private votesService: VotesService,

    private imagesService: ImagesService
  ) {}

  async getProposal(id: number, relations?: string[]) {
    return this.repository.findOne({ where: { id }, relations });
  }

  async getProposals(where?: FindOptionsWhere<Proposal>) {
    return this.repository.find({ where });
  }

  async getProposalVotesByBatch(proposalIds: number[]) {
    const votes = await this.votesService.getVotes({
      proposalId: In(proposalIds),
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
    {
      actionType,
      groupDescription,
      groupName,
      images,
      ...proposalData
    }: CreateProposalInput,
    user: User
  ) {
    const proposal = await this.repository.save({
      ...proposalData,
      action: {
        actionType,
        groupDescription,
        groupName,
      },
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

  async updateProposal({ id, action, images, ...data }: UpdateProposalInput) {
    // TODO: Add logic for updating proposal action
    console.log(action);

    await this.repository.update(id, data);
    const proposal = await this.getProposal(id);
    if (proposal && images) {
      await this.saveProposalImages(proposal.id, images);
    }
    return { proposal };
  }

  async saveProposalImages(proposalId: number, images: Promise<FileUpload>[]) {
    for (const image of images) {
      const filename = await saveImage(image);
      await this.imagesService.createImage({ filename, proposalId });
    }
  }

  async ratifyProposal(proposalId: number) {
    await this.repository.update(proposalId, {
      stage: ProposalStages.Ratified,
    });
    await this.implementProposal(proposalId);
  }

  // TODO: Add logic for implementing proposal
  async implementProposal(proposalId: number) {
    console.log(proposalId);
  }

  async validateRatificationThreshold(proposalId: number) {
    const proposal = await this.getProposal(proposalId, [
      "group.members",
      "votes",
    ]);
    if (
      !proposal ||
      proposal.stage !== ProposalStages.Voting ||
      proposal.votes.length < MIN_VOTE_COUNT_TO_RATIFY ||
      proposal.group.members.length < MIN_GROUP_SIZE_TO_RATIFY
    ) {
      return false;
    }

    const {
      group: { members },
      votes,
    } = proposal;

    const ratificationThreshold =
      DefaultGroupSettings.RatificationThreshold * 0.01;

    // TODO: Add support for other voting models
    return this.validateConsensus(ratificationThreshold, members, votes);
  }

  async validateConsensus(
    ratificationThreshold: number,
    groupMembers: GroupMember[],
    votes: Vote[]
  ) {
    const { agreements, reservations, standAsides, blocks } =
      sortConsensusVotesByType(votes);

    return (
      agreements.length >= groupMembers.length * ratificationThreshold &&
      reservations.length <= DefaultGroupSettings.ReservationsLimit &&
      standAsides.length <= DefaultGroupSettings.StandAsidesLimit &&
      blocks.length === 0
    );
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
