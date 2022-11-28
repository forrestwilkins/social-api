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
import { Post } from "../../posts/models/post.model";
import { User } from "../../users/models/user.model";

@ObjectType()
@Entity()
export class Image {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field()
  filename: string;

  @Column({ nullable: true })
  @Field()
  imageType: string;

  @Field(() => Post)
  @ManyToOne(() => Post, (post) => post.images, {
    onDelete: "CASCADE",
  })
  post: Post;

  @Column({ nullable: true })
  postId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.images, {
    onDelete: "CASCADE",
  })
  user: User;

  @Column({ nullable: true })
  userId: number;

  @Field(() => Group)
  @ManyToOne(() => Group, (group) => group.images, {
    onDelete: "CASCADE",
  })
  group: Group;

  @Column({ nullable: true })
  groupId: number;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
