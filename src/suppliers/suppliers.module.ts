import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';

@Module({
  controllers: [SuppliersController],
  providers: [SuppliersService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Supplier])
  ],
  exports: [TypeOrmModule]
})
export class SuppliersModule {}
