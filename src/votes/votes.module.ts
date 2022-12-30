import { Module } from "@nestjs/common";
import { VotesResolver } from "./votes.resolver";
import { VotesService } from "./votes.service";

@Module({
  providers: [VotesService, VotesResolver],
})
export class VotesModule {}
