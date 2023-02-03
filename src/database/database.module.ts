import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Environments } from "../common/common.constants";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DB_HOST"),
        database: configService.get("DB_SCHEMA"),
        username: configService.get("DB_USERNAME"),
        password: configService.get("DB_PASSWORD"),
        port: parseInt(configService.get("DB_PORT") as string),

        synchronize: configService.get("NODE_ENV") === Environments.Development,
        entities: ["dist/**/*{.entity,.model}{.ts,.js}"],
        migrations: ["migrations/*.js"],
      }),
    }),
  ],
})
export class DatabaseModule {}
