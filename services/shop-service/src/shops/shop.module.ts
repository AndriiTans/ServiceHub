import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from './entities/shop.entity';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { CustomerModule } from 'src/customers/customer.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([Shop]), CustomerModule, SharedModule],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [TypeOrmModule, ShopService],
})
export class ShopModule {}
