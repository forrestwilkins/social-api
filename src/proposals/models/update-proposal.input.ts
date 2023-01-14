import { Field, InputType, Int } from "@nestjs/graphql";
import { FileUpload, GraphQLUpload } from "graphql-upload";

@InputType()
export class UpdateProposalInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  body: string;

  @Field({ nullable: true })
  action: string;

  @Field(() => [GraphQLUpload], { nullable: true })
  images?: Promise<FileUpload>[];
}
