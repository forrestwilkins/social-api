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
import { GroupMember } from "../group-members/models/group-member.model";
import { MemberRequest } from "../member-requests/models/member-request.model";

@Entity()
@ObjectType()
export class Group {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ unique: true })
  @Field()
  name: string;

  @Column()
  @Field()
  description: string;

  @OneToMany(() => Post, (post) => post.group, {
    cascade: true,
  })
  @Field(() => [Post])
  posts: Post[];

  @OneToMany(() => Image, (image) => image.group, {
    cascade: true,
  })
  @Field(() => [Image])
  images: Image[];

  @OneToMany(() => GroupMember, (member) => member.group, {
    cascade: true,
  })
  @Field(() => [GroupMember])
  members: GroupMember[];

  @OneToMany(() => MemberRequest, (memberRequest) => memberRequest.group, {
    cascade: true,
  })
  memberRequests: MemberRequest[];

  @Field(() => Image, { nullable: true })
  coverPhoto: Image;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
