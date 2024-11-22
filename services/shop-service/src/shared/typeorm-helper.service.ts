import { Injectable } from '@nestjs/common';
import { Repository, FindOptionsWhere, DeepPartial } from 'typeorm';

@Injectable()
export class TypeOrmHelperService {
  async findOrCreate<T>(
    repository: Repository<T>,
    conditions: FindOptionsWhere<T>,
    createData: DeepPartial<T>,
  ): Promise<T> {
    const existing = await repository.findOne({ where: conditions });
    return existing || repository.save(repository.create(createData));
  }
}
