import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class PostInput {
  @Field(() => Int, { nullable: true })
  groupId: number;

  @Field({ nullable: true })
  body: string;
}
