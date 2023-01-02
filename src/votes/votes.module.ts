import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Vote } from "./models/vote.model";
import { VotesResolver } from "./votes.resolver";
import { VotesService } from "./votes.service";

@Module({
  imports: [TypeOrmModule.forFeature([Vote])],
  providers: [VotesService, VotesResolver],
})
export class VotesModule {}
