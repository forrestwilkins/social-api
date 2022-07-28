import { TypeOrmModuleOptions } from "@nestjs/typeorm";

require("dotenv").config();

const ormconfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA,
  entities: ["dist/**/*{.entity,.model}{.ts,.js}"],
  migrations: ["migrations/*.js"],
  synchronize: process.env.NODE_ENV === "development",
};

export default ormconfig;
