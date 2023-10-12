import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from 'src/auth/entities/user.entity';
import { Cloudinary } from 'src/common/libs/cloudinary';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { ProductImage } from './entities/product-image.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger();

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly cloudinary: Cloudinary,
    private readonly dataSource: DataSource
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

  async findAll() {
    const products =  await this.productRepository.find({where: { isAvailable: true }});
    return products.map(product => ({
      ...product,
      images: product.images.map(image => image.url)
    }))
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOneBy({ id, isAvailable: true });

    if(!product) {
      throw new BadRequestException('Product not found');
    }

    return {
      ...product,
      images: product.images.map(image => image.url)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto, files: Express.Multer.File[], user: User) {
    
    const { images, ...productDto } = updateProductDto;

    const produt = await this.productRepository.findOneBy({ id });

    const productToUpdate = await this.productRepository.preload({
      id,
      ...productDto
    })

    if(!produt) {
      throw new BadRequestException('Product not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if(files.length > 0) {
        
        const uploadImages = await this.cloudinary.uploadImage(files.map(file => file.path));

        productToUpdate.images = uploadImages.map(image => this.productImageRepository.create({
          public_id: image.public_id,
          url: image.secure_url
        }))

        await this.cloudinary.deleteImage(produt.images.map(image => image.public_id));
      }

      productToUpdate.user = user;
      await queryRunner.manager.save(productToUpdate);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      
      return this.findOne(id);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDbException(error);
    }
  }

  async remove(id: string) {
    try {
      const product = await this.productRepository.findOneBy({ id });

      if(!product) {
        throw new BadRequestException('Product not found');
      }
      await this.productRepository.update(id, { isAvailable: false});
      return true;
    } catch (error) {
      this.handleDbException(error);
    }
  }

  private handleDbException(error: any) {
    if(error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
  }
}
