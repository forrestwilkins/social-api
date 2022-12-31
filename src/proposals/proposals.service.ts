import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { User } from "../users/models/user.model";
import { CreateProposalInput } from "./models/create-proposal.input";
import { Proposal } from "./models/proposal.model";

@Injectable()
export class ProposalsService {
  constructor(
    @InjectRepository(Proposal)
    private repository: Repository<Proposal>
  ) {}

  async getProposal(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  async getProposals(where?: FindOptionsWhere<Proposal>) {
    return this.repository.find({ where });
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
