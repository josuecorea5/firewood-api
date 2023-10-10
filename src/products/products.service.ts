import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from 'src/auth/entities/user.entity';
import { Cloudinary } from 'src/common/libs/cloudinary';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ProductImage } from './entities/product-image.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger();

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly cloudinary: Cloudinary
  ) { 
  }

  async create(createProductDto: CreateProductDto, images: Express.Multer.File[], user: User) {
    try {
      const uploadedImages = await this.cloudinary.uploadImage(images.map(image => image.path));

      const product = this.productRepository.create({
        ...createProductDto,
        user: user,
        images: uploadedImages.map(image => this.productImageRepository.create({
          public_id: image.public_id,
          url: image.secure_url
        }))
      })

      await this.productRepository.save(product);
      delete product.user;
      return {
        ...product,
        images: product.images.map(image => image.url)
      }
      
    } catch (error) {
      console.log(error)
      this.handleDbException(error);
    }
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  private handleDbException(error: any) {
    if(error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
  }
}
