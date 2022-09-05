import { Field, ID, InputType } from "@nestjs/graphql";
import { GraphQLUpload } from "graphql-upload-minimal";
import { FileUpload } from "../../images/images.service";

@InputType()
export class PostInput {
  @Field((_type) => ID, { nullable: true })
  id?: number;

  @Field()
  body: string;

  @Field((_type) => [GraphQLUpload])
  images: Promise<FileUpload[]>;
}
