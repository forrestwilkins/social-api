import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { ProposalAction } from "./models/proposal-action.model";
import { ProposalActionsService } from "./proposal-actions.service";

@Resolver(() => ProposalAction)
export class ProposalActionsResolver {
  constructor(private proposalActionsService: ProposalActionsService) {}

  @ResolveField(() => Image)
  async groupCoverPhoto(@Parent() { id }: ProposalAction) {
    return this.proposalActionsService.getProposedGroupCoverPhoto(id);
  }
}
