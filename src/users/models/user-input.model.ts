import { Field, ID, InputType } from "@nestjs/graphql";

@InputType()
export class UserInput {
  @Field((_type) => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  bio: string;
}
