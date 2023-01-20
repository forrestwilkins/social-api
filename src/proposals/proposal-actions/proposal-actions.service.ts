import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, In, Repository } from "typeorm";
import { ProposalAction } from "./models/proposal-action.model";

@Injectable()
export class ProposalActionsService {
  constructor(
    @InjectRepository(ProposalAction)
    private repository: Repository<ProposalAction>
  ) {}

  async getProposalActions(where?: FindOptionsWhere<ProposalAction>) {
    return this.repository.find({ where });
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
}
