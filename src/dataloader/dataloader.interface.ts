import * as DataLoader from "dataloader";
import { Image } from "../images/models/image.model";
import { User } from "../users/models/user.model";

export interface Dataloaders {
  postImagesLoader: DataLoader<number, Image[]>;
  usersLoader: DataLoader<number, User>;
}
