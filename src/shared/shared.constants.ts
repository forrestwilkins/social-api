export const VALID_NAME_CHARACTERS = /^[A-Za-z0-9 ]+$/;

export enum Environments {
  Development = "development",
  Production = "production",
}

export enum PortDefaults {
  DB_PORT = 5432,
  SERVER_PORT = 3100,
}
