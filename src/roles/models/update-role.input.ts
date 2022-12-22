import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class UpdateRoleInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  color?: string;

  @Field(() => [Int], { nullable: true })
  selectedUserIds?: number[];
}
