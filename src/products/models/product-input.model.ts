import { Field, ID, InputType, Int } from "@nestjs/graphql";

@InputType()
export class ProductInput {
  @Field((_type) => ID, { nullable: true })
  id?: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field((_type) => Int)
  price: number;
}
