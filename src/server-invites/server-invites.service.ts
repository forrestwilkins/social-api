import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
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

  async getServerInvite(id: number, relations?: string[]) {
    return this.repository.findOneOrFail({ where: { id }, relations });
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
}
