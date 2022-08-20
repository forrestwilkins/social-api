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
import { Image } from "../../images/models/image.model";
import { User } from "../../users/models/user.model";

@ObjectType()
@Entity()
export class Post {
  @Field((_type) => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  body: string;

  @Field((_type) => [Image])
  @OneToMany(() => Image, (image) => image.post)
  images: Image[];

  @ManyToOne(() => User, (user) => user.posts, { onDelete: "CASCADE" })
  @Field((_type) => User)
  user: User;

  @Column()
  @Field()
  userId: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
