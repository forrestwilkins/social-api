import { Field, Int, ObjectType } from "@nestjs/graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Group } from "../../groups/models/group.model";

@Entity()
@ObjectType()
export class Role {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  color: string;

  @Field(() => Group, { nullable: true })
  @ManyToOne(() => Group, (group) => group.posts, { onDelete: "CASCADE" })
  group: Group;

  @Column({ nullable: true })
  groupId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
