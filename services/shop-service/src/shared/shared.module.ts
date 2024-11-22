import { Module, forwardRef } from '@nestjs/common';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { OwnershipGuard } from 'src/common/guards/ownership.guard';
import { TypeOrmHelperService } from './typeorm-helper.service';
import { CustomerModule } from 'src/customers/customer.module';

@Module({
  imports: [forwardRef(() => CustomerModule)], // Use forwardRef to break circular dependency
  providers: [TypeOrmHelperService, AdminGuard, OwnershipGuard],
  exports: [TypeOrmHelperService, AdminGuard, OwnershipGuard],
})
export class SharedModule {}
