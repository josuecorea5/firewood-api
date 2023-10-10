import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Cloudinary } from './libs/cloudinary';

@Module({
  imports: [ConfigModule],
  providers: [Cloudinary],
  exports: [CommonModule, Cloudinary]
})
export class CommonModule {}
