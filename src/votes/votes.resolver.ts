import { Args, Int, Query, Resolver } from "@nestjs/graphql";
import { Vote } from "./models/vote.model";
import { VotesService } from "./votes.service";

@Resolver(() => Vote)
export class VotesResolver {
  constructor(private votesService: VotesService) {}

  @Query(() => Vote)
  async vote(@Args("id", { type: () => Int }) id: number) {
    return this.votesService.getVote(id);
  }

  @Query(() => [Vote])
  async votes() {
    return this.votesService.getVotes();
  }
}
