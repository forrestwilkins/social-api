import { config } from "dotenv";
import { DataSource } from "typeorm";
import { RefreshToken } from "./src/auth/refresh-tokens/models/refresh-token.model";
import { GroupMember } from "./src/groups/group-members/models/group-member.model";
import { MemberRequest } from "./src/groups/member-requests/models/member-request.model";
import { Group } from "./src/groups/models/group.model";
import { Image } from "./src/images/models/image.model";
import { Post } from "./src/posts/models/post.model";
import { Proposal } from "./src/proposals/models/proposal.model";
import { ProposalAction } from "./src/proposals/proposal-actions/models/proposal-action.model";
import { Role } from "./src/roles/models/role.model";
import { Permission } from "./src/roles/permissions/models/permission.model";
import { RoleMember } from "./src/roles/role-members/models/role-member.model";
import { User } from "./src/users/models/user.model";
import { Vote } from "./src/votes/models/vote.model";

config();

export default new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  database: process.env.DB_SCHEMA,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
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
});
