import { Field, InputType, Int } from "@nestjs/graphql";
import { FileUpload, GraphQLUpload } from "graphql-upload";

@InputType()
export class CreateProposalInput {
  @Field(() => Int, { nullable: true })
  groupId: number;

  @Field({ nullable: true })
  body: string;

  @Field()
  actionType: string;

  @Field({ nullable: true })
  groupName: string;

  @Field({ nullable: true })
  groupDescription: string;

  @Field(() => [GraphQLUpload], { nullable: true })
  images?: Promise<FileUpload>[];
}
