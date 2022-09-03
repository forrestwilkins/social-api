import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "../users/users.module";
import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_KEY,
    }),
  ],
  providers: [AuthResolver, AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
