import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFiles, UseInterceptors, ParseFilePipe, HttpStatus, BadRequestException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/auth/enums/roles.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { imageFilter } from 'src/common/helpers/image-filter.helper';
import { diskStorage } from 'multer';
import { generateImageName } from 'src/common/helpers/image-name.helper';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { ApiTags, ApiConsumes, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Auth(Roles.ADMIN)
  @Post()
  @UseInterceptors(FilesInterceptor('images',3, {
    fileFilter: imageFilter,
    storage: diskStorage({filename: generateImageName})
  }))
  @ApiConsumes('multipart/form-data')
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User,
    @UploadedFiles(
      new ParseFilePipe({
        exceptionFactory: () => new BadRequestException('Format image not valid'),
      })
    ) files: Express.Multer.File[]
  ) {
    return this.productsService.create(createProductDto, files, user);
  }

  @Auth(Roles.ADMIN)
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Auth(Roles.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Auth(Roles.ADMIN)
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images', 3, {
    fileFilter: imageFilter,
    storage: diskStorage({filename: generateImageName})
  }))
  @ApiConsumes('multipart/form-data')
  update(
    @Param('id') id: string, 
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
    @UploadedFiles(
      new ParseFilePipe({
        exceptionFactory: () => new BadRequestException('Format image not valid'),
        fileIsRequired: false
      })
    )
    files: Express.Multer.File[]
    ) {
    return this.productsService.update(id, updateProductDto, files, user);
  }

  @ApiResponse({description: 'A boolean that indicates if the product was deleted'})
  @Auth(Roles.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
