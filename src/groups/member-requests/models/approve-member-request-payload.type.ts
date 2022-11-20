import { Field, ObjectType } from "@nestjs/graphql";
import { GroupMember } from "../../group-members/models/group-member.model";

@ObjectType()
export class ApproveMemberRequestPayload {
  @Field(() => GroupMember)
  groupMember: GroupMember;
}
