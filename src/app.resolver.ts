// TODO: Add proper health module: https://docs.nestjs.com/recipes/terminus

import { Query, Resolver } from "@nestjs/graphql";

@Resolver()
export class AppResolver {
  @Query(() => String)
  async welcome() {
    return `Welcome to Social API — ${new Date().toISOString()}`;
  }
}
