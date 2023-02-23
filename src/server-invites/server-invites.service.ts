import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserInputError, ValidationError } from "apollo-server-express";
import * as cryptoRandomString from "crypto-random-string";
import { FindOptionsWhere, Repository } from "typeorm";
import { User } from "../users/models/user.model";
import { CreateServerInviteInput } from "./models/create-server-invite.input";
import { ServerInvite } from "./models/server-invite.model";

@Injectable()
export class ServerInvitesService {
  constructor(
    @InjectRepository(ServerInvite)
    private repository: Repository<ServerInvite>
  ) {}

  async getServerInvite(
    where: FindOptionsWhere<ServerInvite>,
    relations?: string[]
  ) {
    const serverInvite = await this.repository.findOne({ where, relations });
    if (!serverInvite) {
      throw new UserInputError("Invite not found");
    }
    return serverInvite;
  }

  async getServerInvites(where?: FindOptionsWhere<ServerInvite>) {
    return this.repository.find({ where });
  }

  async createServerInvite(
    serverInviteData: CreateServerInviteInput,
    user: User
  ) {
    const token = cryptoRandomString({ length: 8 });
    const serverInvite = await this.repository.save({
      ...serverInviteData,
      userId: user.id,
      token,
    });
    return { serverInvite };
  }

  async redeemServerInvite(token: string) {
    const serverInvite = await this.getServerInvite({ token });
    const isValid = await this.validateServerInvite(serverInvite.id);
    if (!isValid) {
      throw new ValidationError("Invalid server invite");
    }
    await this.repository.update(serverInvite.id, {
      uses: serverInvite.uses + 1,
    });
    return true;
  }

  async validateServerInvite(serverInviteId: number) {
    const serverInvite = await this.getServerInvite({ id: serverInviteId });

    const isExpired =
      serverInvite.expiresAt && Number(serverInvite.expiresAt) >= Date.now();
    const maxUsesReached =
      serverInvite.maxUses && serverInvite.uses >= serverInvite.maxUses;

    if (isExpired || maxUsesReached) {
      return false;
    }
    return true;
  }

  async deleteServerInvite(serverInviteId: number) {
    await this.repository.delete(serverInviteId);
    return true;
  }
}
