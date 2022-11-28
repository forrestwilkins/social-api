import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class UpdatePostInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  body: string;
}
