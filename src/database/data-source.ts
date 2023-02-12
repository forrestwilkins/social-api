import { config } from "dotenv";
import { DataSource } from "typeorm";
import { Initial1675388391336 } from "./migrations/1675388391336-Initial";
import { RefreshToken } from "../auth/refresh-tokens/models/refresh-token.model";
import { GroupMember } from "../groups/group-members/models/group-member.model";
import { MemberRequest } from "../groups/member-requests/models/member-request.model";
import { Group } from "../groups/models/group.model";
import { Image } from "../images/models/image.model";
import { Post } from "../posts/models/post.model";
import { Proposal } from "../proposals/models/proposal.model";
import { ProposalAction } from "../proposals/proposal-actions/models/proposal-action.model";
import { Role } from "../roles/models/role.model";
import { Permission } from "../roles/permissions/models/permission.model";
import { RoleMember } from "../roles/role-members/models/role-member.model";
import { User } from "../users/models/user.model";
import { Vote } from "../votes/models/vote.model";

config();

export default new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  database: process.env.DB_SCHEMA,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT as string),
  entities: [
    Group,
    GroupMember,
    Image,
    MemberRequest,
    Permission,
    Post,
    Proposal,
    ProposalAction,
    RefreshToken,
    Role,
    RoleMember,
    User,
    Vote,
  ],
  migrations: [Initial1675388391336],
});
