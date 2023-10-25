import { Repository, SelectQueryBuilder } from "typeorm"
import { Supplier } from "./entities/supplier.entity"
import { SuppliersService } from "./suppliers.service"
import { Test, TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { Buying } from "src/buyings/entities/buying.entity"
import { User } from "src/auth/entities/user.entity"

describe('SupplierService', () => {
  let supplierRepository: Repository<Supplier>
  let supplierService: SuppliersService;

  const mockSupplier = {
    fullName: 'test',
    telephone: '123212132',
    address: 'this is a test address'
  }

  const suppliers = [
    {
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
    {
      id: '1234',
      fullName: 'test',
      telephone: '123',
      address: 'test',
      isActive: true,
      createdAt: new Date('2021-01-01'),
      updatedAt: new Date('2021-01-01'),
      user: {} as User,
      buying: {} as Buying
    }
  ]

  beforeEach(async() => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuppliersService,
        {
          provide: getRepositoryToken(Supplier),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            preload: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            createQueryBuilder: jest.fn()
          }
        }
      ]
    }).compile();

    supplierService = module.get<SuppliersService>(SuppliersService);
    supplierRepository = module.get<Repository<Supplier>>(getRepositoryToken(Supplier));
  })

  afterAll(() => {
    jest.clearAllMocks();
  })

  it('should be defined', () => {
    expect(supplierService).toBeDefined();
  })

  describe('create a supplier', () => {
    it('should be create a supplier', async ()  => {
      jest.spyOn(supplierRepository, 'create').mockReturnValue({
        ...mockSupplier,
        id: '123',
        buying: {} as Buying,
        user: {} as User,
        isActive: true,
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2021-01-01')
      })

      const supplier = await supplierService.create(mockSupplier, { id: '123'} as User);
      expect(supplier.id).toEqual('123');
      expect(supplierRepository.save).toHaveBeenCalled();
      expect(supplier.user).toBeUndefined();
    })
  } )

  describe('find suppliers', () => {
    it('should find all supliers', async() => {
      jest.spyOn(supplierRepository, 'find').mockResolvedValue(suppliers);
      const supplierList = await supplierService.findAll({limit: 2, offset: 0});
      expect(supplierList.length).toEqual(2); 
    })

    it('should find one supplier by id', async() => {
      jest.spyOn(supplierRepository, 'findOneBy').mockResolvedValue(suppliers[0]);
      const supplier = await supplierService.findOne('f47f3bd9-1977-4a32-a8c6-6ee5be3e4a64');
      expect(supplier.id).toEqual('123');
    })

    it('should find one supplier by name', async() => {
      const mockQueryBuilder: Partial<SelectQueryBuilder<Supplier>> = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(suppliers[0])
      };
    
      jest.spyOn(supplierRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as SelectQueryBuilder<Supplier>);

      const supplier = await supplierService.findOne('test');
      expect(supplier.fullName).toEqual('test');
      expect(mockQueryBuilder.where).toHaveBeenCalled();
    })

    it('should throw an error when supplier not found', async() => {
      const mockQueryBuilder: Partial<SelectQueryBuilder<Supplier>> = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null)
      };
      
      jest.spyOn(supplierRepository, 'findOneBy').mockResolvedValue(null);

      jest.spyOn(supplierRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as SelectQueryBuilder<Supplier>);
      try {
        await supplierService.findOne('test');  
      } catch (error) {
        expect(error.message).toEqual('Supplier not found');
      }
    })
  })

  describe('update supplier', () => {
    it('should update a supplier', async() => {
      const updateSupplierDto = {
        fullName: 'test updated'
      }

      jest.spyOn(supplierRepository, 'preload').mockResolvedValue({
        id: '123',
        fullName: updateSupplierDto.fullName
      } as Supplier);

      await supplierService.update('123', updateSupplierDto, { id: '123'} as User);

      expect(supplierRepository.preload).toHaveBeenCalledWith({ id: '123', fullName: updateSupplierDto.fullName})

      expect(supplierRepository.save).toHaveBeenCalled();
    })
  })

  describe('change status supplier', () => {
    it('should change status supplier', async () => {
      const supplierUpdated = {
        ...suppliers[0],
        isActive: false
      }

      jest.spyOn(supplierRepository, 'findOneBy').mockResolvedValue({
        id: '123',
      } as Supplier);
      jest.spyOn(supplierRepository, 'update').mockResolvedValue({
        ...supplierUpdated,
        raw: [],
        generatedMaps: []
      })
      const supplier = await supplierService.remove('f47f3bd9-1977-4a32-a8c6-6ee5be3e4a64');
      expect(supplierRepository.update).toHaveBeenCalledWith('123', { isActive: false })
      expect(supplier).toEqual(true);
    })
  })
})