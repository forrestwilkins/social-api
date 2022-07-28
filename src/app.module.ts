import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppResolver } from "./app.resolver";
import { AuthModule } from "./auth/auth.module";
import { ImagesModule } from "./images/images.module";
import ormconfig from "./ormconfig";
import { ProductsModule } from "./products/products.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      cors: { origin: true, credentials: true },
      csrfPrevention: process.env.NODE_ENV !== "development",
    }),
    AuthModule,
    ImagesModule,
    ProductsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppResolver],
})
export class AppModule {}
