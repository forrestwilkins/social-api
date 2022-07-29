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
  @OneToMany(() => Image, (image) => image.product)
  images: Image[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
