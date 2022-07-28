import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../../users/users.module";
import { AuthModule } from "../auth.module";
import { JwtRefreshStrategy } from "./strategies/jwt-refresh.strategy";
import { RefreshToken } from "./models/refresh-token.model";
import { RefreshTokensResolver } from "./refresh-tokens.resolver";
import { RefreshTokensService } from "./refresh-tokens.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken]),
    forwardRef(() => AuthModule),
    UsersModule,
  ],
  providers: [RefreshTokensService, RefreshTokensResolver, JwtRefreshStrategy],
  exports: [RefreshTokensService],
})
export class RefreshTokensModule {}
