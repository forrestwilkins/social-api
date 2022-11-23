import { Field, ObjectType } from "@nestjs/graphql";
import { MemberRequest } from "./member-request.model";

@ObjectType()
export class CreateMemberRequestPayload {
  @Field(() => MemberRequest)
  memberRequest: MemberRequest;
}
