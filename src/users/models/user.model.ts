import { Field, Int, ObjectType } from "@nestjs/graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { RefreshToken } from "../../auth/refresh-tokens/models/refresh-token.model";
import { Post } from "../../posts/models/post.model";

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field((_type) => Int)
  id: number;

  @Column({ unique: true })
  @Field()
  name: string;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column()
  @Field()
  password: string;

  @OneToMany(() => Post, (post) => post.user, {
    cascade: true,
  })
  @Field((_type) => [Post])
  posts: Post[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {
    cascade: true,
  })
  @Field((_type) => [RefreshToken])
  refreshTokens: RefreshToken[];

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
