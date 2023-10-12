import { Module } from '@nestjs/common';
import { BuyingsService } from './buyings.service';
import { BuyingsController } from './buyings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Buying } from './entities/buying.entity';
import { AuthModule } from 'src/auth/auth.module';
import { SuppliersModule } from 'src/suppliers/suppliers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Buying]),
    AuthModule,
    SuppliersModule
  ],
  controllers: [BuyingsController],
  providers: [BuyingsService],
})
export class BuyingsModule {}
