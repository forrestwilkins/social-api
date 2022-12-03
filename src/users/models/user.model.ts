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
import { Image } from "../../images/models/image.model";
import { Post } from "../../posts/models/post.model";
import { RoleMember } from "../../roles/role-members/models/role-member.model";

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ unique: true })
  @Field()
  name: string;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  bio: string;

  @OneToMany(() => Post, (post) => post.user, {
    cascade: true,
  })
  @Field(() => [Post])
  posts?: Post[];

  @OneToMany(() => Image, (image) => image.user, {
    cascade: true,
  })
  images?: Image[];

  @Field(() => Image)
  profilePicture: Image;

  @Field(() => Image, { nullable: true })
  coverPhoto: Image;

  @OneToMany(() => RoleMember, (roleMember) => roleMember.user, {
    cascade: true,
  })
  roleMemberships: RoleMember[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {
    cascade: true,
  })
  refreshTokens: RefreshToken[];

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
