import { DataSource, EntityManager, QueryRunner, Repository } from "typeorm";
import { ProductsService } from "./products.service"
import { Product } from "./entities/product.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ProductImage } from "./entities/product-image.entity";
import { Cloudinary } from "../common/libs/cloudinary";
import { User } from "src/auth/entities/user.entity";
import { Inventory } from "src/inventory/entities/inventory.entity";
import { Sale } from "src/sales/entities/sale.entity";

describe('ProductsService', () => {
  let productService: ProductsService;
  let productRepository: Repository<Product>;
  let productImageRepository: Repository<ProductImage>;
  let mockQueryRunner: Partial<QueryRunner>;
  let mockEntityManager: Partial<EntityManager>;
  let cloudinary: Cloudinary;

  const mockProducts = [
    {
      id: '123',
      title: 'test',
      description: 'test description',
      price: 123,
      isAvailable: true,
      user: {} as User,
      inventory: {} as Inventory,
      sales: {} as Sale,
      createdAt: new Date('2021-01-01'),
      updatedAt: new Date('2021-01-01'),
      images: [{
        id: '123',
        public_id: '123',
        url: 'url',
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2021-01-01'),
        product: {} as Product
      },
      {
        id: '1234',
        public_id: '1234',
        url: 'url',
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2021-01-01'),
        product: {} as Product
      }
      
    ] as ProductImage[],
    },
    {
      id: '1234',
      title: 'test',
      description: 'test description',
      price: 123,
      isAvailable: true,
      inventory: {} as Inventory,
      sales: {} as Sale,
      user: {} as User,
      createdAt: new Date('2021-01-01'),
      updatedAt: new Date('2021-01-01'),
      images: [{
        id: '123',
        public_id: '123',
        url: 'url',
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2021-01-01'),
        product: {} as Product
      },
      {
        id: '1234',
        public_id: '1234',
        url: 'url',
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2021-01-01'),
        product: {} as Product
      }
      
    ] as ProductImage[],
    }
  ]

  beforeEach(async() => {

    mockEntityManager = {
      update: jest.fn().mockResolvedValue({ affected: 1}),
      save: jest.fn().mockResolvedValue({ affected: 1}),
    }

    mockQueryRunner = {
      startTransaction: jest.fn().mockResolvedValue(undefined),
      connect: jest.fn().mockResolvedValue(undefined),
      rollbackTransaction: jest.fn().mockResolvedValue(undefined),
      commitTransaction: jest.fn().mockResolvedValue(undefined),
      release: jest.fn().mockResolvedValue(undefined),
      manager: mockEntityManager as unknown as EntityManager,
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            preload: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn(),
          }
        },
        {
          provide: getRepositoryToken(ProductImage),
          useValue: {
            create: jest.fn(),
          }
        },
        {
          provide: Cloudinary,
          useValue: {
            uploadImage: jest.fn(),
            deleteImage: jest.fn()
          }
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner)
          }
        }
      ]
    }).compile();
    productService = module.get<ProductsService>(ProductsService);
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
    productImageRepository = module.get<Repository<ProductImage>>(getRepositoryToken(ProductImage));
    cloudinary = module.get<Cloudinary>(Cloudinary);
  })

  afterAll(() => {
    jest.clearAllMocks();
  })

  it('should be defined', () => {
    expect(productService).toBeDefined();
  })

  describe('create product', () => {
    const productDto = {
      title: 'Product 1',
      description: 'Product 1 description',
      price: 100,
      images: []
    }
    const mockImagesMulter = [
      {
        path: 'path1'
      },
      {
        path: 'path2'
      }
    ] as Express.Multer.File[];

    const mockImages = [
      {
        public_id: 'public_id',
        secure_url: 'secure_url'
      },
      {
        public_id: 'public_id',
        secure_url: 'secure_url'
      }
    ]
    it('should create a product', async() => {
      jest.spyOn(cloudinary, 'uploadImage').mockResolvedValue(mockImages)
      jest.spyOn(productRepository, 'create').mockReturnValue({
        ...productDto,
        images: mockImages.map((image, index) => ({
          id: (index + 1).toString(),
          public_id: image.public_id,
          url: image.secure_url,
          createdAt: new Date('2021-01-01'),
          updatedAt: new Date('2021-01-01'),
          product: {} as Product
        })),
        id: '123',
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2021-01-01'),
        isAvailable: true,
        user: {} as unknown as User,
        inventory: {} as unknown as Inventory,
        sales: {} as unknown as Sale
      })
      const newProduct = await productService.create(productDto, mockImagesMulter, {id: '123'} as User);
      expect(newProduct).toEqual({
        ...productDto,
        images: mockImages.map(image => image.secure_url),
        id: '123',
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2021-01-01'),
        isAvailable: true,
        inventory: {} as unknown as Inventory,
        sales: {} as unknown as Sale
      })
      expect(productImageRepository.create).toHaveBeenCalledTimes(2);
      expect(productRepository.save).toHaveBeenCalled();
    })
  })

  describe('find products', () => {
    it('should find all products', async() => {
      jest.spyOn(productRepository, 'find').mockResolvedValue(mockProducts);
      const products = await productService.findAll();
      expect(products.length).toEqual(2);
    })

    it('should find a product by id', async() => {
      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(mockProducts[0]);
      const product = await productService.findOne('123');
      expect(product.id).toEqual('123');
    })

    it('should thrown an error if product not found', async() => {
      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(null);
      try {
        await productService.findOne('1232');
      } catch (error) {
        expect(error.message).toEqual('Product not found');
      }
    })
  })

  describe('update product', () => {
    const updateProductDto = {
      price: 250
    }
    it('should thrown an exception if product is not found', async() => {
      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(null);
      try {
        await productService.update('1232', updateProductDto, [], { id: '123'} as User);
      } catch (error) {
        expect(error.message).toEqual('Product not found');
      }
    });

    it('should update a product without image', async() => {
      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(mockProducts[0]);
      jest.spyOn(productRepository, 'preload').mockResolvedValue({
        id: '123',
        price: updateProductDto.price
      } as Product);
      jest.spyOn(productService, 'findOne').mockResolvedValue({
        ...mockProducts[0],
        images: mockProducts[0].images.map(image => image.url),
        price: updateProductDto.price,
      })
      const product = await productService.update('123', updateProductDto, [], { id: '123'} as User);
      expect(product.price).toEqual(updateProductDto.price);
      expect(productRepository.preload).toHaveBeenCalled();
      expect(mockEntityManager.save).toHaveBeenCalled();
      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('should update images of a product', async() => {
      const images = [
        { path: 'image.jpg'},
        { path: 'image2.jpg'}
      ] as Express.Multer.File[];
      const mockImagesCloudinary = [
        {public_id: '1', secure_url: 'image.jpg'},
        {public_id: '2', secure_url: 'image2.jpg'}
      ];
      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(mockProducts[0]);
      jest.spyOn(productRepository, 'preload').mockResolvedValue(mockProducts[0]);
      jest.spyOn(cloudinary, 'uploadImage').mockResolvedValue(mockImagesCloudinary);
      jest.spyOn(productService, 'findOne').mockResolvedValue({
        ...mockProducts[0],
        images: mockImagesCloudinary.map(image => image.secure_url)
      })
      jest.spyOn(productImageRepository, 'create').mockReturnValue([
        {
          id: '1',
          public_id: '1',
          url: mockImagesCloudinary[0].secure_url,
          createdAt: new Date('2021-01-01'),
          updatedAt: new Date('2021-01-01'),
          product: {} as Product
        },
        {
          id: '2',
          public_id: '2',
          url: mockImagesCloudinary[1].secure_url,
          createdAt: new Date('2021-01-01'),
          updatedAt: new Date('2021-01-01'),
          product: {} as Product
        }
      ] as unknown as ProductImage)
      const updateProduct = await productService.update('123', {}, images, { id: '123'} as User);
      expect(productRepository.preload).toHaveBeenCalled();
      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(updateProduct.images.length).toEqual(2);
      expect(cloudinary.deleteImage).toHaveBeenCalledWith(mockProducts[0].images.map(image => image.public_id)); 
    })
  })

  describe('should remove a product', () => {
    it('should thrown an error if product not found', async() => {
      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(null);
      try {
        await productService.remove('12345');
      } catch (error) {
        expect(error.message).toStrictEqual('Product not found');
      }
    })
    it('should change isAvailable to false', async() => {
      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(mockProducts[0]);
      const removeProduct = await productService.remove('123');
      expect(productRepository.update).toHaveBeenCalledWith('123', {
        isAvailable: false
      })
      expect(removeProduct).toBeTruthy();
    })
  })
})