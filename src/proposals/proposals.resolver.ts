import { Resolver } from "@nestjs/graphql";
import { Proposal } from "./models/proposal.model";

@Resolver(() => Proposal)
export class ProposalsResolver {}
