import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DB_PORT_DEFAULT, Environments } from "./shared/shared.constants";
require("dotenv").config();

const ormconfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || DB_PORT_DEFAULT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA,
  entities: ["dist/**/*{.entity,.model}{.ts,.js}"],
  migrations: ["migrations/*.js"],
  synchronize: process.env.NODE_ENV === Environments.Development,
};

export default ormconfig;
