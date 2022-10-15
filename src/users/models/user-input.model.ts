// TODO: Add error handling for field validation

import { Field, ID, InputType } from "@nestjs/graphql";
import { Matches } from "class-validator";
import { VALID_NAME_CHARACTERS } from "../../shared/constants";

@InputType()
export class UserInput {
  @Field((_type) => ID)
  id: number;

  @Field()
  @Matches(VALID_NAME_CHARACTERS, {
    message: "Usernames cannot contain special characters",
  })
  name: string;

  @Field()
  email: string;

  @Field()
  bio: string;
}
