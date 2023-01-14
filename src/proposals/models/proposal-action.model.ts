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

// TODO: Add fields to ProposalAction model
// input ActionDataInput {
//   groupName: String
//   groupImage: FileUpload
//   groupDescription: String
//   groupSettings: [SettingInput]
//   groupRole: CreateRoleInput
//   groupRolePermissions: [ProposedPermissionInput]
//   groupEvent: EventMotionInput
//   groupRoleId: String
//   userId: String
// }

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
  @OneToOne(() => Proposal, (proposal) => proposal.action)
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
