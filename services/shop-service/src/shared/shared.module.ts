import { Module } from '@nestjs/common';
import { TypeOrmHelperService } from './typeorm-helper.service';

@Module({
  providers: [TypeOrmHelperService],
  exports: [TypeOrmHelperService],
})
export class SharedModule {}
