import { Repository } from "typeorm";
import { InventoryService } from "./inventory.service"
import { Inventory } from "./entities/inventory.entity";
import { Buying } from "../buyings/entities/buying.entity";
import { Product } from "../products/entities/product.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "../auth/entities/user.entity";
import { Sale } from "../sales/entities/sale.entity";
import { Supplier } from "../suppliers/entities/supplier.entity";
import { ProductImage } from "../products/entities/product-image.entity";

describe('InventoryService', () => {
  let inventoryService: InventoryService;
  let inventoryRepository: Repository<Inventory>;
  let buyingRepository: Repository<Buying>;
  let productRepository: Repository<Product>;

  const mockProduct = {
    id: '123',
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

  const mockInventory = [
    {
      id: '123',
      stock: 2,
      unitPrice: 10,
      isActive: true,
      user: {} as User,
      buying: {} as Buying,
      product: {} as Product,
      createdAt: new Date('2021-01-01'),
      updatedAt: new Date('2021-01-01')
    },
    {
      id: '1234',
      stock: 2,
      unitPrice: 10,
      isActive: true,
      user: {} as User,
      buying: {} as Buying,
      product: {} as Product,
      createdAt: new Date('2021-01-01'),
      updatedAt: new Date('2021-01-01')
    }
  ]

  const mockBuying = {
    id: '123',
    title: 'test',
    amount: 2,
    price: 123,
    supplier: {} as Supplier,
    inventory: {} as Inventory,
    user: {} as User,
    product: {} as Product,
    createdAt: new Date('2021-01-01'),
    updatedAt: new Date('2021-01-01')
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: getRepositoryToken(Inventory),
          useValue: {
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            preload: jest.fn()
          }
        },
        {
          provide: getRepositoryToken(Buying),
          useValue: {
            findOneBy: jest.fn()
          }
        },
        {
          provide: getRepositoryToken(Product),
          useValue: {
            findOneBy: jest.fn()
          }
        }
      ]
    }).compile();

    inventoryService = module.get<InventoryService>(InventoryService);
    inventoryRepository = module.get<Repository<Inventory>>(getRepositoryToken(Inventory));
    buyingRepository = module.get<Repository<Buying>>(getRepositoryToken(Buying));
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
  })

  afterAll(() => {
    jest.clearAllMocks();
  })

  it('should be defined', () => {
    expect(inventoryService).toBeDefined();
  })

  describe('create a inventory', () => {
    const createInventoryDto = {
      stock: 2,
      unitPrice: 10,
      buyingId: '123',
      productId: '123'
    }

    it('should thrown an error if buying not foud', async() => {
      jest.spyOn(buyingRepository, 'findOneBy').mockResolvedValue(null);
      try {
        await inventoryService.create(createInventoryDto, { id: '123'} as User);
      } catch (error) {
        expect(error.message).toEqual('Buying not found');
      }
    })

    it('should throen an error if product not found', async() => {
      jest.spyOn(buyingRepository, 'findOneBy').mockResolvedValue(mockBuying);
      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(null);
      try {
        await inventoryService.create(createInventoryDto, { id: '123'} as User);
      } catch (error) {
        expect(error.message).toEqual('Product not found');
      }
    })

    it('should create a inventory', async() => {
      const user = { id: '123' } as User;
      jest.spyOn(buyingRepository, 'findOneBy').mockResolvedValue(mockBuying);
      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(mockProduct);
      jest.spyOn(inventoryRepository, 'create').mockReturnValue({
        ...createInventoryDto,
        id: '123',
        isActive: true,
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2021-01-01'),
        user,
        buying: mockBuying,
        product: mockProduct
      })

      const inventory = await inventoryService.create(createInventoryDto, user);

      expect(inventoryRepository.save).toBeCalled();
      expect(inventory.user).not.toBeDefined();
    })
  })

  describe('find all inventory', () => {
    it('should return all inventory', async() => {
      jest.spyOn(inventoryRepository, 'find').mockResolvedValue(mockInventory);
      const inventory = await inventoryService.findAll();
      expect(inventory.length).toEqual(2);
    })

    it('shuold thrown an error if inventory not found', async() => {
      jest.spyOn(inventoryRepository, 'findOneBy').mockResolvedValue(null);
      try {
        await inventoryService.findOne('123');
      } catch (error) {
        expect(error.message).toEqual('Inventory not found');
      }
    })

    it('shuold return a inventory by id', async() => {
      jest.spyOn(inventoryRepository, 'findOneBy').mockResolvedValue(mockInventory[0]);
      const inventoryById = await inventoryService.findOne('123');
      expect(inventoryById.id).toEqual('123');
    })

    it('should find stock by product id', async() => {
      const mockStockByProductId = [{
          id: '1234',
          stock: 2,
          unitPrice: 10,
          isActive: true,
          user: {} as User,
          buying: {} as Buying,
          product: {id: '12345'} as Product,
          createdAt: new Date('2021-01-01'),
          updatedAt: new Date('2021-01-01')
      }];
      jest.spyOn(inventoryRepository, 'find').mockResolvedValue(mockStockByProductId);
      const stock = await inventoryService.findStockByProductId('12345');
      expect(stock[0].product.id).toEqual('12345');
    })
  })

  describe('update inventory', () => {
    it('should change state of inventory', async() => {
      jest.spyOn(inventoryRepository, 'findOneBy').mockResolvedValue(mockInventory[0]);
      await inventoryService.changeStateInventory('123', false);
      expect(inventoryRepository.update).toHaveBeenCalled();
    })
    const updateInventoryDto = {
      buyingId: '123',
      productId: '123',
      stock: 2,
    }
    
    it('should thrown a exception if inventory does not exist', async() => {
      const user = { id: '123' } as User;
      jest.spyOn(inventoryRepository, 'preload').mockResolvedValue(null);
      try {
        await inventoryService.update('123', updateInventoryDto, user);
      } catch (error) {
        expect(error.message).toEqual('Inventory not found');
      }
    })

    it('should thrown aception if buying does not exist', async() => {
      const user = { id: '123' } as User;
      jest.spyOn(inventoryRepository, 'preload').mockResolvedValue({
        id: '123',
        stock: updateInventoryDto.stock
      } as Inventory);
      jest.spyOn(inventoryRepository, 'findOneBy').mockResolvedValue(mockInventory[0]);
      jest.spyOn(buyingRepository, 'findOneBy').mockResolvedValue(null);
      try {
        await inventoryService.update('123', updateInventoryDto, user);
      } catch (error) {
        expect(error.message).toEqual('Buying not found');
      }
    })

    it('should thrown a exception if product does not exist', async() => {
      const user = { id: '123' } as User;
      jest.spyOn(inventoryRepository, 'preload').mockResolvedValue({
        id: '123',
        stock: updateInventoryDto.stock
      } as Inventory);
      jest.spyOn(inventoryRepository, 'findOneBy').mockResolvedValue(mockInventory[0]);
      jest.spyOn(buyingRepository, 'findOneBy').mockResolvedValue(mockBuying);
      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(null);
      try {
        await inventoryService.update('123', updateInventoryDto, user);
      } catch (error) {
        expect(error.message).toEqual('Product not found');
      }
    })

    it('should update an inventory', async() => {
      const user = { id: '123' } as User;
      jest.spyOn(inventoryRepository, 'preload').mockResolvedValue({
        id: '123',
        stock: updateInventoryDto.stock
      } as Inventory);
      jest.spyOn(inventoryRepository, 'findOneBy').mockResolvedValue(mockInventory[0]);
      jest.spyOn(buyingRepository, 'findOneBy').mockResolvedValue(mockBuying);
      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(mockProduct);

      const updateInventory = await inventoryService.update('123', updateInventoryDto, user);
      expect(inventoryRepository.save).toHaveBeenCalled();
      expect(updateInventory.stock).toEqual(updateInventoryDto.stock);
    })
  })

  describe('remove inventory', () => {
    it('should change inventory state to false', async() => {
      jest.spyOn(inventoryService, 'findOne').mockResolvedValue(mockInventory[0]);
      const removeInventory = await inventoryService.remove('123');
      expect(inventoryRepository.update).toHaveBeenCalledWith('123', { isActive: false })
      expect(removeInventory).toBeTruthy();
    })
  })
})