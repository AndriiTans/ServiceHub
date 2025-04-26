import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { getMetadataArgsStorage } from 'typeorm';
import { TableMetadataArgs } from 'typeorm/metadata-args/TableMetadataArgs';
import { join } from 'path';
import { DatabaseConfig } from './config/database.config';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { CustomerModule } from './customers/customer.module';
import { AppResolver } from './app.resolver';
import { ShopModule } from './shops/shop.module';
import { ProductModule } from './products/product.module';
import { OrderModule } from './orders/order.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(DatabaseConfig),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      // Specifies the ApolloDriver to use with Apollo Server
      driver: ApolloDriver,
      // Automatically generates the GraphQL schema file based on TypeScript code (code-first approach)
      autoSchemaFile: true,
      // Enables introspection, allowing clients to query the GraphQL schema structure
      // Recommended to disable in production for security reasons
      introspection: process.env.NODE_ENV !== 'production',
      // Enables GraphQL Playground for testing the API in development mode only
      // It is turned off in production to prevent exposing sensitive API details
      playground: process.env.NODE_ENV !== 'production',
    }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'uploads'),
    //   serveRoot: '/uploads',
    // }),
    CustomerModule,
    ShopModule,
    ProductModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(AppController);

    const entities = getMetadataArgsStorage().tables.map((table: TableMetadataArgs) => {
      return (table.target as Function).name;
    });

    console.log('Loaded Entities:', entities);
  }
}
