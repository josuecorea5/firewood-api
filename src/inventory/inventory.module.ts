import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { ProductsModule } from 'src/products/products.module';
import { BuyingsModule } from 'src/buyings/buyings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventory]),
    AuthModule,
    ProductsModule,
    BuyingsModule
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [TypeOrmModule]
})
export class InventoryModule {}
