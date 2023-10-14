import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ProductsModule } from 'src/products/products.module';
import { InventoryModule } from 'src/inventory/inventory.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale]),
    AuthModule,
    ProductsModule,
    InventoryModule
  ],
  controllers: [SalesController],
  providers: [SalesService],
  exports: [TypeOrmModule]
})
export class SalesModule {}
