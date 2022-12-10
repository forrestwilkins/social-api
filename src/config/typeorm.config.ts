import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Environments } from "../shared/shared.constants";
require("dotenv").config();

const typeOrmConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA,
  entities: ["dist/**/*{.entity,.model}{.ts,.js}"],
  migrations: ["migrations/*.js"],
  synchronize: process.env.NODE_ENV === Environments.Development,
};

export default typeOrmConfig;
