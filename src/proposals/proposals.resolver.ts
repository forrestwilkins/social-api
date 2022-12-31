import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "../users/models/user.model";
import { CreateProposalInput } from "./models/create-proposal.input";
import { CreateProposalPayload } from "./models/create-proposal.payload";
import { Proposal } from "./models/proposal.model";
import { ProposalsService } from "./proposals.service";

@Resolver(() => Proposal)
export class ProposalsResolver {
  constructor(private proposalsService: ProposalsService) {}

  @Mutation(() => CreateProposalPayload)
  async createProposal(
    @Args("proposalData") proposalData: CreateProposalInput,
    @CurrentUser() user: User
  ) {
    return this.proposalsService.createProposal(user, proposalData);
  }
}
