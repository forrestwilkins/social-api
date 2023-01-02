import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Dataloaders } from "../dataloader/dataloader.service";
import { User } from "../users/models/user.model";
import { CreateVoteInput } from "./models/create-vote.input";
import { CreateVotePayload } from "./models/create-vote.payload";
import { UpdateVoteInput } from "./models/update-vote.input";
import { UpdateVotePayload } from "./models/update-vote.payload";
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

  @ResolveField(() => User)
  async user(
    @Context() { loaders }: { loaders: Dataloaders },
    @Parent() { userId }: Vote
  ) {
    return loaders.usersLoader.load(userId);
  }

  @Mutation(() => CreateVotePayload)
  async createVote(
    @Args("voteData") voteData: CreateVoteInput,
    @CurrentUser() user: User
  ) {
    return this.votesService.createVote(voteData, user.id);
  }

  @Mutation(() => UpdateVotePayload)
  async updateVote(@Args("voteData") voteData: UpdateVoteInput) {
    return this.votesService.updateVote(voteData);
  }

  @Mutation(() => Boolean)
  async deleteVote(@Args("id", { type: () => Int }) id: number) {
    return this.votesService.deleteVote(id);
  }
}
