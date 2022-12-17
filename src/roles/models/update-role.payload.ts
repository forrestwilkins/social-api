import { Field, ObjectType } from "@nestjs/graphql";
import { Role } from "./role.model";

@ObjectType()
export class UpdateRolePayload {
  @Field()
  role: Role;
}
