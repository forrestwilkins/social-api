import { Field, Int, ObjectType } from "@nestjs/graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../../users/models/user.model";

@ObjectType()
@Entity()
export class ServerInvite {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field()
  token: string;

  @Column({ default: 0 })
  uses: number;

  @Column({ nullable: true })
  maxUses?: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.serverInvites, { onDelete: "CASCADE" })
  user: User;

  @Column()
  userId: number;

  @Column({ nullable: true })
  @Field()
  expiresAt?: Date;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}