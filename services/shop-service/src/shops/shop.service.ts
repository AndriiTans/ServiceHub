import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from './entities/shop.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { ShopUpdateDto } from './dto/shop-update.dto';
import { ShopCreateDto } from './dto/shop-create.dto';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async getAllShops(): Promise<Shop[]> {
    // return this.shopRepository
    //   .createQueryBuilder('shop')
    //   .leftJoinAndSelect('shop.owner', 'owner') // Join the owner (Customer)
    //   .select(['shop.id', 'shop.name', 'shop.description', 'owner.id']) // Select specific fields
    //   .addSelect(['shop.rating', 'shop.income', 'shop.isActive']) // Optional additional fields
    //   .getRawMany(); // Use getRawMany to get the flattened result
    return await this.shopRepository.find({
      relations: [
        'owner',
        'owner.address',
        'owner.address.city',
        'owner.address.state',
        'owner.address.country',
        'products',
        'orders',
      ],
    });
  }

  async getShopByUserId(userId: number): Promise<Shop> {
    return this.shopRepository.findOne({
      where: { owner: { userId } },
      relations: ['owner'],
    });
  }

  async createShop(ownerId: number, createShopInput: ShopCreateDto): Promise<Shop> {
    const { name, description } = createShopInput;

    const existingShop = await this.shopRepository.findOne({ where: { owner: { id: ownerId } } });
    if (existingShop) {
      throw new BadRequestException(`Owner with ID ${ownerId} already owns a shop.`);
    }

    const newShop = this.shopRepository.create({
      name,
      description,
      owner: { id: ownerId },
      rating: 0,
      income: 0,
      isActive: true,
    });

    const savedShop = await this.shopRepository.save(newShop);

    return savedShop;
  }

  async updateShop(userId: number, shopUpdateInput: ShopUpdateDto): Promise<Shop> {
    const existingShop = await this.shopRepository.findOne({
      where: { owner: { userId } },
      relations: ['owner'],
    });

    if (!existingShop) {
      throw new BadRequestException(`Shop for owner with userId ${userId} not found.`);
    }

    Object.assign(existingShop, shopUpdateInput);

    return this.shopRepository.save(existingShop);
  }

  async deleteShopById(id: number): Promise<boolean> {
    const shop = await this.shopRepository.findOne({
      where: { id },
    });

    if (shop) {
      await this.shopRepository.remove(shop);

      return true;
    }

    return false;
  }
}
