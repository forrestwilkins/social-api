import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class ProposalActionInput {
  @Field()
  actionType: string;

  @Field({ nullable: true })
  groupName: string;

  @Field({ nullable: true })
  groupDescription: string;
}
