import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppResolver } from "./app.resolver";
import { AuthModule } from "./auth/auth.module";
import { DataloaderModule } from "./dataloader/dataloader.module";
import { DataloaderService } from "./dataloader/dataloader.service";
import { ImagesModule } from "./images/images.module";
import ormconfig from "./ormconfig";
import { PostsModule } from "./posts/posts.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [DataloaderModule],
      inject: [DataloaderService],
      useFactory: (dataloaderService: DataloaderService) => ({
        autoSchemaFile: true,
        cors: { origin: true, credentials: true },
        csrfPrevention: process.env.NODE_ENV !== "development",
        context: () => ({
          loaders: dataloaderService.getLoaders(),
        }),
      }),
    }),
    AuthModule,
    DataloaderModule,
    ImagesModule,
    PostsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppResolver],
})
export class AppModule {}
