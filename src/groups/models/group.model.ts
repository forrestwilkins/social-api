import { Field, Int, ObjectType } from "@nestjs/graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Image } from "../../images/models/image.model";
import { Post } from "../../posts/models/post.model";
import { Role } from "../../roles/models/role.model";
import { GroupMember } from "../group-members/models/group-member.model";
import { MemberRequest } from "../member-requests/models/member-request.model";

@Entity()
@ObjectType()
export class Group {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Field()
  name: string;

  @Column()
  @Field()
  description: string;

  @Field(() => [Post])
  @OneToMany(() => Post, (post) => post.group, {
    cascade: true,
  })
  posts: Post[];

  @OneToMany(() => Image, (image) => image.group, {
    cascade: true,
  })
  images: Image[];

  @Field(() => [GroupMember])
  @OneToMany(() => GroupMember, (member) => member.group, {
    cascade: true,
  })
  members: GroupMember[];

  @OneToMany(() => MemberRequest, (memberRequest) => memberRequest.group, {
    cascade: true,
  })
  memberRequests: MemberRequest[];

  @Field(() => [Role])
  @OneToMany(() => Role, (role) => role.group, {
    cascade: true,
  })
  roles: Role[];

  @Field(() => Image, { nullable: true })
  coverPhoto: Image;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
