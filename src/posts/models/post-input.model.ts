import { Field, ID, InputType } from "@nestjs/graphql";

@InputType()
export class PostInput {
  @Field((_type) => ID, { nullable: true })
  id?: number;

  @Field((_type) => ID, { nullable: true })
  groupId?: number;

  @Field()
  body: string;
}
