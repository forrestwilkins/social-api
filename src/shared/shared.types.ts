import { JwtPayload } from "jsonwebtoken";
import { RefreshTokensService } from "../auth/refresh-tokens/refresh-tokens.service";
import { Dataloaders } from "../dataloader/dataloader.service";
import { User } from "../users/models/user.model";
import { UserPermissions } from "../users/users.service";

export interface Context {
  loaders: Dataloaders;
  permissions: UserPermissions | null;
  claims: {
    accessTokenClaims: JwtPayload | null;
    refreshTokenClaims: JwtPayload | null;
  };
  refreshTokensService: RefreshTokensService;
  user: User | null;
}
