import { DataSource, EntityManager, QueryRunner, Repository } from "typeorm";
import { SalesService } from "./sales.service"
import { Sale } from "./entities/sale.entity";
import { Product } from "../products/entities/product.entity";
import { InventoryService } from "../inventory/inventory.service";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "src/auth/entities/user.entity";
import { ProductImage } from "../products/entities/product-image.entity";
import { Inventory } from "../inventory/entities/inventory.entity";
import { Buying } from "src/buyings/entities/buying.entity";
import { SaleStatus } from "./enums/sales-status.enum";

describe('SalesService', () => {
  let saleService: SalesService;
  let saleRepository: Repository<Sale>;
  let productRepository: Repository<Product>;
  let inventoryService: InventoryService;
  let mockQueryRunner: Partial<QueryRunner>;
  let mockEntityManager: Partial<EntityManager>;

  const saleCreateDto = {
    productId: '123',
    quantity: 2
  }

  const mockProduct = {
    id: '1234',
    title: 'test',
    description: 'test',
    price: 123,
    isAvailable: true,
    user: {} as User,
    images: [] as ProductImage[],
    inventory: {} as Inventory,
    sales: {} as Sale,
    createdAt: new Date('2021-01-01'),
    updatedAt: new Date('2021-01-01')
  }

  const mockSales = [
    {
      id: '123',
      quantity: 2,
      total: 0,
      status: SaleStatus.COMPLETED,
      user: {} as User,
      product: {} as Product,
      createdAt: new Date('2021-01-01'),
      updatedAt: new Date('2021-01-01')
    },
    {
      id: '1234',
      quantity: 2,
      total: 0,
      status: SaleStatus.COMPLETED,
      user: {} as User,
      product: {} as Product,
      createdAt: new Date('2021-01-01'),
      updatedAt: new Date('2021-01-01')
    }
  ]

  beforeEach(async() => {

    mockEntityManager = {
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      save: jest.fn().mockResolvedValue({ affected: 1 }),
    }

    mockQueryRunner = {
      connect: jest.fn().mockResolvedValue(undefined),
      startTransaction: jest.fn().mockResolvedValue(undefined),
      rollbackTransaction: jest.fn().mockResolvedValue(undefined),
      commitTransaction: jest.fn().mockResolvedValue(undefined),
      release: jest.fn().mockResolvedValue(undefined),
      manager: mockEntityManager as unknown as EntityManager
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesService,
        {
          provide: getRepositoryToken(Sale),
          useValue: {
            findOneBy: jest.fn(),
            create: jest.fn(),
            find: jest.fn(),
            update: jest.fn()
          }
        },
        {
          provide: getRepositoryToken(Product),
          useValue: {
            findOneBy: jest.fn()
          }
        },
        {
          provide: InventoryService,
          useValue: {
            findStockByProductId: jest.fn(),
            update: jest.fn()
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

    saleService = module.get<SalesService>(SalesService);
    saleRepository = module.get<Repository<Sale>>(getRepositoryToken(Sale));
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
    inventoryService = module.get<InventoryService>(InventoryService);
  })

  afterAll(() => {
    jest.clearAllMocks();
  })

  it('should be defined', () => {
    expect(saleService).toBeDefined();
  })

  describe('create a sale', ()  => {
    it('should thrown an error if product not found', async() => {
      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(null);
      try {
        await saleService.create(saleCreateDto, { id: '123'} as User);
      } catch (error) {
        expect(error.message).toEqual('Product not found');
      }
    })

    it('should thrown an error if product is not available', async() => {
      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(mockProduct);
      jest.spyOn(inventoryService, 'findStockByProductId').mockResolvedValue([]);
      try {
        await saleService.create(saleCreateDto, { id: '123'} as User);
      } catch (error) {
        expect(error.message).toEqual('Product not available in stock');
      }
    })

    it('should thrown an error if quantity is greater than stock', async() => {
      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(mockProduct);
      jest.spyOn(inventoryService, 'findStockByProductId').mockResolvedValue([{
        id: '123',
        stock: 1,
        unitPrice: 123,
        isActive: true,
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2021-01-01'),
        user: {} as User,
        buying: {} as Buying,
        product: {} as Product
      }]);

      try {
        await saleService.create(saleCreateDto, { id: '123'} as User);
      } catch (error) {
        expect(error.message).toEqual('Product not available in stock');
      }
    })

    it('should create a sale', async() => {
      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(mockProduct);
      jest.spyOn(inventoryService, 'findStockByProductId').mockResolvedValue([{
        id: '123',
        stock: 3,
        unitPrice: 123,
        isActive: true,
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2021-01-01'),
        user: {} as User,
        buying: {} as Buying,
        product: {} as Product
      }]);
      jest.spyOn(saleRepository, 'create').mockReturnValue({
        ...saleCreateDto,
        id: '123',
        user: {} as User,
        product: {} as Product,
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2021-01-01'),
        total: 0,
        status: SaleStatus.COMPLETED
      })
      const sale = await saleService.create(saleCreateDto, { id: '123'} as User);

      expect(sale.id).toEqual('123');
      expect(sale.total).toEqual(mockProduct.price * saleCreateDto.quantity);
      expect(mockEntityManager.update).toHaveBeenCalled();
      expect(mockEntityManager.save).toHaveBeenCalled();
    })
  })

  describe('find sales', () => {
    it('should find all sales', async() => {
      jest.spyOn(saleRepository, 'find').mockResolvedValue(mockSales);
      const sales = await saleService.findAll();
      expect(sales.length).toEqual(2);
    })

    it('should find one sale by id', async() => {
      jest.spyOn(saleRepository, 'findOneBy').mockResolvedValue(mockSales[0]);
      const sale = await saleService.findOne('123');
      expect(sale.id).toEqual('123');
    })

    it('should thrown an error if sale not found', async() => {
      jest.spyOn(saleRepository, 'findOneBy').mockResolvedValue(null);
      try {
        await saleService.findOne('1232');
      } catch (error) {
        expect(error.message).toEqual('Sale not found');
      }
    })
  })

  describe('update sale', () => {
    it('should thrown an exception if sale is not found', async() => {
      jest.spyOn(saleRepository, 'findOneBy').mockResolvedValue(null);
      try {
        await saleService.update('1234', { id: '123'} as User);
      } catch (error) {
        expect(error.message).toEqual('Sale not found');
      }
    })

    it('should thrown an exception if there are not open inventories',async() => {
      jest.spyOn(saleRepository, 'findOneBy').mockResolvedValue(mockSales[0]);
      jest.spyOn(inventoryService, 'findStockByProductId').mockResolvedValue(undefined);
      try {
        await saleService.update('1234', { id: '123'} as User);
      } catch (error) {
        expect(error.message).toEqual('Product not available in stock');
      }
    })

    it('should cancel a sale', async() => {
      jest.spyOn(saleRepository, 'findOneBy').mockResolvedValue(mockSales[0]);
      jest.spyOn(inventoryService, 'findStockByProductId').mockResolvedValue([{
        id: '123',
        stock: 3,
        unitPrice: 123,
        isActive: true,
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2021-01-01'),
        user: {} as User,
        buying: {} as Buying,
        product: {id: '123'} as Product
      }]);
      const cancelledSale = await saleService.update('1234', { id: '123'} as User);
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
      expect(cancelledSale.message).toEqual('Sale cancelled successfully');
    })
  })
})