import { Field, ID, InputType } from "@nestjs/graphql";
import { FileUpload, GraphQLUpload } from "graphql-upload-minimal";

@InputType()
export class PostInput {
  @Field((_type) => ID, { nullable: true })
  id?: number;

  @Field()
  body: string;

  @Field((_type) => [GraphQLUpload])
  images: Promise<FileUpload>[];
}
