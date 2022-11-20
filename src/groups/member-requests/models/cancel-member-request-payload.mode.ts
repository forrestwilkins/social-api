import { Field, ObjectType } from "@nestjs/graphql";
import { Group } from "../../models/group.model";

@ObjectType()
export class CancelMemberRequestPayload {
  @Field(() => Group)
  group: Group;
}
