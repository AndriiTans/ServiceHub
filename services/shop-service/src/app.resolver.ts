import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query(() => String)
  checkStatus() {
    return 'Service is running!';
  }
}
