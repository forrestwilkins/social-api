/**
 * TODO: Add the following fields (pulled from Praxis) to ProposalAction model below:
 * groupEvent: EventMotionInput
 * groupImage: FileUpload
 * groupRole: CreateRoleInput
 * groupRoleId: String
 * groupRolePermissions: [ProposedPermissionInput]
 * groupSettings: [SettingInput]
 * userId: String
 */

import { Field, Int, ObjectType } from "@nestjs/graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Proposal } from "./proposal.model";

@Entity()
@ObjectType()
export class ProposalAction {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  actionType: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  groupName: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  groupDescription: string;

  @Field(() => Proposal)
  @OneToOne(() => Proposal, (proposal) => proposal.action, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  proposal: Proposal;

  @Column()
  proposalId: number;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
