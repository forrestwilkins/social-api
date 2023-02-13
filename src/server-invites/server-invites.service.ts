import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
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
}
