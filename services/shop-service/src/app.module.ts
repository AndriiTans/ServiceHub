import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getMetadataArgsStorage } from 'typeorm';
import { DatabaseConfig } from './config/database.config';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { CustomerModule } from './customers/customer.module';

console.log('DatabaseConfig -> ', DatabaseConfig);
@Module({
  imports: [TypeOrmModule.forRoot(DatabaseConfig), CustomerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(AppController);

    const entities = getMetadataArgsStorage().tables.map(
      (table: any) => (table.target as Function).name,
    );
    console.log('Loaded Entities:', entities);
  }
}
