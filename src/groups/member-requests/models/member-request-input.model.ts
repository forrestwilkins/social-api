// TODO: Add error handling for field validation

import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class MemberRequestInput {
  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  groupId: number;
}
