import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class UpdateRoleInput {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  color: string;
}
