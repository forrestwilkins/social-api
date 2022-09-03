import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ValidationError } from "apollo-server-express";
import { compare, hash } from "bcrypt";
import { User } from "../users/models/user.model";
import { UsersService } from "../users/users.service";
import { LoginInput } from "./models/login.input";
import { SignUpInput } from "./models/sign-up.input";
import { AccessTokenPayload } from "./strategies/jwt.strategy";

const ACCESS_TOKEN_EXPIRES_IN = 60 * 60 * 24 * 30;
const SALT_ROUNDS = 10;

export interface AuthCookiePayload {
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async login({ email, password }: LoginInput) {
    const user = await this.validateUser(email, password);
    return this.generateAccessToken(user.id);
  }

  async signUp({ password, ...rest }: SignUpInput) {
    const passwordHash = await hash(password, SALT_ROUNDS);
    const user = await this.usersService.createUser({
      password: passwordHash,
      ...rest,
    });
    return this.generateAccessToken(user.id);
  }

  async validateUser(email: string, password: string): Promise<Partial<User>> {
    try {
      const user = await this.usersService.getUser({ where: { email } });
      if (!user) {
        throw new ValidationError("User not found");
      }

      const passwordMatch = await compare(password, user.password);
      if (!passwordMatch) {
        throw new ValidationError("Incorrect username or password");
      }

      const { password: _password, ...result } = user;
      return result;
    } catch (err) {
      throw new ValidationError(err);
    }
  }

  async generateAccessToken(userId: number) {
    const payload: AccessTokenPayload = { sub: userId };
    return this.jwtService.signAsync(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
  }
}
