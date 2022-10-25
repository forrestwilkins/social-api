import { Field, Int, ObjectType } from "@nestjs/graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../../../users/models/user.model";
import { Group } from "../../models/group.model";

@Entity()
@ObjectType()
export class MemberRequest {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  status: string;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: "CASCADE" })
  @Field(() => User)
  user: User;

  @Column()
  @Field()
  userId: number;

  @ManyToOne(() => Group, (group) => group.posts, { onDelete: "CASCADE" })
  @Field(() => Group, { nullable: true })
  group: Group;

  @Column({ nullable: true })
  @Field({ nullable: true })
  groupId: number;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
