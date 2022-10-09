import { Field, ID, InputType } from "@nestjs/graphql";

@InputType()
export class GroupInput {
  @Field((_type) => ID, { nullable: true })
  id?: number;

  @Field()
  name: string;

  @Field()
  description: string;
}
