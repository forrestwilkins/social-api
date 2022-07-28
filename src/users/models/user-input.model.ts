import { Field, ID, InputType } from "@nestjs/graphql";

@InputType()
export class UserInput {
  @Field((_type) => ID, { nullable: true })
  id?: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;
}
