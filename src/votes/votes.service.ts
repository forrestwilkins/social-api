import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { Vote } from "./models/vote.model";

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private repository: Repository<Vote>
  ) {}

  async getVote(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  async getVotes(where?: FindOptionsWhere<Vote>) {
    return this.repository.find({ where });
  }
}
