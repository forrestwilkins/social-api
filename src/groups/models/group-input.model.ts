// TODO: Add error handling for field validation

import { Field, ID, InputType } from "@nestjs/graphql";
import { Matches } from "class-validator";
import { VALID_NAME_CHARACTERS } from "../../shared/constants";

@InputType()
export class GroupInput {
  @Field((_type) => ID, { nullable: true })
  id?: number;

  @Field()
  @Matches(VALID_NAME_CHARACTERS, {
    message: "Group names cannot contain special characters",
  })
  name: string;

  @Field()
  description: string;
}
