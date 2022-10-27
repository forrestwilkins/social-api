import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class PostInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int, { nullable: true })
  groupId?: number;

  @Field()
  body: string;
}
