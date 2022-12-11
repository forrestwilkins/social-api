// TODO: Add error handling for field validation

import { Field, InputType } from "@nestjs/graphql";
import { Matches } from "class-validator";
import { VALID_NAME_CHARACTERS } from "../../shared/shared.constants";

@InputType()
export class CreateGroupInput {
  @Field()
  @Matches(VALID_NAME_CHARACTERS, {
    message: "Group names cannot contain special characters",
  })
  name: string;

  @Field()
  description: string;
}
