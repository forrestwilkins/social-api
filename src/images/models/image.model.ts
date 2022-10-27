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

  @Field()
  @Column()
  filename: string;

  @Field()
  @Column({ nullable: true })
  imageType: string;

  @Field(() => Post)
  @ManyToOne(() => Post, (post) => post.images, {
    onDelete: "CASCADE",
  })
  post: Post;

  @Field()
  @Column({ nullable: true })
  postId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.images, {
    onDelete: "CASCADE",
  })
  user: User;

  @Field()
  @Column({ nullable: true })
  userId: number;

  @Field(() => Group)
  @ManyToOne(() => Group, (group) => group.images, {
    onDelete: "CASCADE",
  })
  group: Group;

  @Field()
  @Column({ nullable: true })
  groupId: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
