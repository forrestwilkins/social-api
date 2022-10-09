// TODO: Determine whether GraphQL models should be separate from TypeORM entities

import { Field, Int, ObjectType } from "@nestjs/graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Group } from "../../groups/models/group.model";
import { Image } from "../../images/models/image.model";
import { User } from "../../users/models/user.model";

@ObjectType()
@Entity()
export class Post {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  body: string;

  @Field(() => [Image])
  @OneToMany(() => Image, (image) => image.post)
  images: Image[];

  @ManyToOne(() => User, (user) => user.posts, { onDelete: "CASCADE" })
  @Field(() => User)
  user: User;

  @Column()
  @Field()
  userId: number;

  @ManyToOne(() => Group, (group) => group.posts, { onDelete: "CASCADE" })
  @Field(() => Group)
  group: Group;

  @Column({ nullable: true })
  @Field()
  groupId: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
