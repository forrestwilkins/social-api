import { Field, InputType, Int } from "@nestjs/graphql";
import { Matches } from "class-validator";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { VALID_NAME_CHARACTERS } from "../../common/common.constants";

@InputType()
export class UpdateGroupInput {
  @Field(() => Int)
  id: number;

  @Field()
  @Matches(VALID_NAME_CHARACTERS, {
    message: "Group names cannot contain special characters",
  })
  name: string;

  @Field()
  description: string;

  @Field(() => GraphQLUpload, { nullable: true })
  coverPhoto?: Promise<FileUpload>;
}
