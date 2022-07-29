import { Field, Int, ObjectType } from "@nestjs/graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Post } from "../../posts/models/post.model";

@ObjectType()
@Entity()
export class Image {
  @Field((_type) => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  filename: string;

  @Field()
  @Column()
  postId: number;

  @Field((_type) => Post)
  @ManyToOne(() => Post, (post) => post.images, {
    onDelete: "CASCADE",
  })
  post: Post;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
