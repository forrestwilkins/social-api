import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { config } from "dotenv";
import { UsersModule } from "../users/users.module";
import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";
import { RefreshTokensModule } from "./refresh-tokens/refresh-tokens.module";
import { JwtStrategy } from "./strategies/jwt.strategy";

config();

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_KEY,
    }),
    forwardRef(() => RefreshTokensModule),
    PassportModule,
    UsersModule,
  ],
  providers: [AuthResolver, AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
