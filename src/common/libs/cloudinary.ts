import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class Cloudinary {
  constructor(
    private readonly configService: ConfigService
  ) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUD_NAME'),
      api_key: this.configService.get('API_KEY'),
      api_secret: this.configService.get('API_SECRET')
    })
  }

  async uploadImage(file: string[]) {
    const uploadedImages = await Promise.all(
      file.map(async (image) => {
        const { secure_url, public_id } = await cloudinary.uploader.upload(image, {folder: 'products'});
        return { secure_url, public_id }
      })
    )
  
    return uploadedImages;
  }
}
