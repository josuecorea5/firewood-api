import { Repository } from "typeorm";
import { BuyingsService } from "./buyings.service"
import { Buying } from "./entities/buying.entity";
import { Supplier } from "../suppliers/entities/supplier.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "../auth/entities/user.entity";
import { Inventory } from "src/inventory/entities/inventory.entity";

describe('BuyingsService', () => {
  let buyingService: BuyingsService;
  let buyingRepository: Repository<Buying>;
  let supplierRepository: Repository<Supplier>;

  const buying = {
    title: 'test',
    amount: 1,
    price: 2,
    supplierId: '123'
  }

  const mockBuyings = [
    {
      id: '123',
      title: 'test',
      amount: 1,
      price: 2,
      supplier: {
        id: '123',
        fullName: 'test',
        telephone: '123',
        address: 'test',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {} as User,
        buying: {} as Buying
      },
      inventory: {} as Inventory,
      user: {} as User,
      createdAt: new Date('2021-01-01'),
      updatedAt: new Date('2021-01-01'),
    },
    {
      id: '1234',
      title: 'test',
      amount: 1,
      price: 2,
      supplier: {
        id: '123',
        fullName: 'test',
        telephone: '123',
        address: 'test',
        isActive: true,
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2021-01-01'),
        user: {} as User,
        buying: {} as Buying
      },
      inventory: {} as Inventory,
      user: {} as User,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BuyingsService,
        {
          provide: getRepositoryToken(Buying),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            preload: jest.fn()
          }
        },
        {
          provide: getRepositoryToken(Supplier),
          useValue: {
            findOneBy: jest.fn()
          }
        }
      ]
    }).compile();

    buyingService = module.get<BuyingsService>(BuyingsService);
    buyingRepository = module.get<Repository<Buying>>(getRepositoryToken(Buying));
    supplierRepository = module.get<Repository<Supplier>>(getRepositoryToken(Supplier));
  })

  afterAll(() => {
    jest.clearAllMocks();
  })

  it('should be defined', () => {
    expect(buyingService).toBeDefined();
  })

  describe('create a buying', () => {
    it('should be create a buying', async() => {
      jest.spyOn(supplierRepository, 'findOneBy').mockResolvedValue({ id: '123' } as Supplier);

      jest.spyOn(buyingRepository, 'create').mockReturnValue({ ...buying, id: '123', supplier: { id: '123' } } as any);

      const result = await buyingService.create(buying, { id: '123' } as any);

      expect(supplierRepository.findOneBy).toHaveBeenCalledWith({ id: '123' });
      expect(result.id).toEqual('123');
      expect(buyingRepository.save).toHaveBeenCalled();
    })

    it('should be throw an error when supplier not found', async() => {
      jest.spyOn(supplierRepository, 'findOneBy').mockResolvedValue(null);      
      const buying = {
        title: 'test',
        amount: 1,
        price: 2,
        supplierId: '1234'
      }
      try {
        await buyingService.create(buying, { id: '123'} as User)
      } catch (error) {
        expect(error.message).toEqual('Supplier not found')
      }
    })
  })
  
  describe('find buyings', () => {
    it('should return all buyins', async() => {
      jest.spyOn(buyingRepository, 'find').mockResolvedValue(mockBuyings)
      const result = await buyingService.findAll();
      expect(result.length).toEqual(2);
    })

    it('should return a buying by id', async() => {
      jest.spyOn(buyingRepository, 'findOneBy').mockResolvedValue(mockBuyings[0]);
      const result = await buyingService.findOne('123');
      expect(result.id).toEqual('123');
    })

    it('should throw an error when buying not found', async() => {
      jest.spyOn(buyingRepository, 'findOneBy').mockResolvedValue(null);
      try {
        await buyingService.findOne('123');
      } catch (error) {
        expect(error.message).toEqual('Buying not found');
      }
    })
  })

  describe('Update a buying', () => {
    it('should update a buying', async() => {
      const buyingDto = {
        title: 'Test updated',
        supplierId: '1234'
      }
      jest.spyOn(buyingRepository, 'findOneBy').mockResolvedValue({
        id: '123'
      } as Buying);
      jest.spyOn(supplierRepository, 'findOneBy').mockResolvedValue({ id: '123' } as Supplier);
      jest.spyOn(buyingRepository, 'preload').mockResolvedValue({
        id: '123',
        title: buyingDto.title,
       } as Buying);

      await buyingService.update('123', buyingDto, { id: '123'} as User)

      expect(buyingRepository.preload).toHaveBeenCalledWith({ id: '123', title: buyingDto.title, user: { id: '123' } as User });
      expect(buyingRepository.save).toHaveBeenCalled();
    })

    it('should throw an error when buying not found', async() => {
      jest.spyOn(buyingRepository, 'findOneBy').mockResolvedValue(null);
      try {
        await buyingService.update('123', {title: 'test updated'}, {} as User);
      } catch (error) {
        expect(error.message).toEqual('Buying not found');
      }
    })

    it('should throw an error when supplier not found', async() => {
      jest.spyOn(buyingRepository, 'findOneBy').mockResolvedValue({ id: '123' } as Buying);
      jest.spyOn(supplierRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(buyingRepository, 'preload').mockResolvedValue({
        id: '123',
        title: 'test updated',
       } as Buying);
      try {
        await buyingService.update('123', {title: 'test updated'}, {} as User);
      } catch (error) {
        expect(error.message).toEqual('Supplier not found');
      }
    })
  })
})