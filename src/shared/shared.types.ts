import { JwtPayload } from "jsonwebtoken";
import { Dataloaders } from "../dataloader/dataloader.service";
import { User } from "../users/models/user.model";
import { UserPermissions } from "../users/users.service";

export interface Context {
  loaders: Dataloaders;
  permissions: UserPermissions | null;
  refreshTokenClaims: JwtPayload | null;
  user: User | null;
}
