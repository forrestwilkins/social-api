import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { Proposal } from "../proposals/models/proposal.model";
import { CreateVoteInput } from "./models/create-vote.input";
import { UpdateVoteInput } from "./models/update-vote.input";
import { Vote } from "./models/vote.model";

type ProposalWithVoteCount = Proposal & { voteCount: number };

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private repository: Repository<Vote>,

    @InjectRepository(Proposal)
    private proposalsRepository: Repository<Proposal>
  ) {}

  async getVote(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  async getVotes(where?: FindOptionsWhere<Vote>) {
    return this.repository.find({ where });
  }

  async getVoteCountByBatch(proposalIds: number[]) {
    const proposals = (await this.proposalsRepository
      .createQueryBuilder("proposal")
      .leftJoinAndSelect("proposal.votes", "vote")
      .loadRelationCountAndMap("proposal.voteCount", "proposal.votes")
      .select(["proposal.id"])
      .whereInIds(proposalIds)
      .getMany()) as ProposalWithVoteCount[];

    return proposalIds.map((id) => {
      const proposal = proposals.find(
        (proposal: Proposal) => proposal.id === id
      );
      if (!proposal) {
        return new Error(`Could not load vote count for proposal: ${id}`);
      }
      return proposal.voteCount;
    });
  }

  async createVote(voteData: CreateVoteInput, userId: number) {
    const vote = await this.repository.save({ ...voteData, userId });
    return { vote };
  }

  async updateVote({ id, ...data }: UpdateVoteInput) {
    await this.repository.update(id, data);
    const vote = await this.getVote(id);
    return { vote };
  }

  async deleteVote(voteId: number) {
    await this.repository.delete(voteId);
    return true;
  }
}
