import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class PostInput {
  @Field((_type) => Int, { nullable: true })
  id?: number;

  @Field((_type) => Int, { nullable: true })
  groupId?: number;

  @Field()
  body: string;
}
