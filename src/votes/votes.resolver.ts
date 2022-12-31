import { Resolver } from "@nestjs/graphql";
import { Vote } from "./models/vote.model";

@Resolver(() => Vote)
export class VotesResolver {}
