import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserInputError, ValidationError } from "apollo-server-express";
import * as cryptoRandomString from "crypto-random-string";
import { FindOptionsWhere, Repository } from "typeorm";
import { User } from "../users/models/user.model";
import { CreateServerInviteInput } from "./models/create-server-invite.input";
import { ServerInvite } from "./models/server-invite.model";
import { validateServerInvite } from "./server-invites.utils";

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
    return this.repository.find({
      order: { createdAt: "DESC" },
      where,
    });
  }

  async getValidServerInvite(token: string) {
    const serverInvite = await this.getServerInvite({ token });
    const isValid = validateServerInvite(serverInvite);
    if (!isValid) {
      throw new ValidationError("Invalid server invite");
    }
    return serverInvite;
  }

  async getValidServerInvites() {
    const serverInvites = await this.getServerInvites();

    return serverInvites.reduce<ServerInvite[]>((result, serverInvite) => {
      const isValid = validateServerInvite(serverInvite);
      if (isValid) {
        result.push(serverInvite);
      }
      return result;
    }, []);
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
    const isValid = await this.validateServerInvite(token);
    if (!isValid) {
      throw new ValidationError("Invalid server invite");
    }
    const serverInvite = await this.getServerInvite({ token });
    await this.repository.update(serverInvite.id, {
      uses: serverInvite.uses + 1,
    });
  }

  async validateServerInvite(token: string) {
    const serverInvite = await this.getServerInvite({ token });
    return validateServerInvite(serverInvite);
  }

  async deleteServerInvite(serverInviteId: number) {
    await this.repository.delete(serverInviteId);
    return true;
  }
}
