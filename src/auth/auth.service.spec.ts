import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service"
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Supplier } from "src/suppliers/entities/supplier.entity";
import { Product } from "src/products/entities/product.entity";
import { Buying } from "src/buyings/entities/buying.entity";
import { Inventory } from "src/inventory/entities/inventory.entity";
import { Sale } from "src/sales/entities/sale.entity";

const mockUser = {
  id: "123",
  fullName: "John Doe",
  password: "hashedPassword",
  email: "test@test.com",
  isActive: false,
  roles: [],
  image: "",
  createdAt: undefined,
  updatedAt: undefined,
  supplier: {} as Supplier,
  product: {}  as Product,
  buying: {} as Buying,
  inventory: {} as Inventory,
  sales: {}  as Sale,
  emailToLowerCase: function (): void {
    throw new Error("Function not implemented.");
  },
  emailToLowerCaseOnUpdate: function (): void {
    throw new Error("Function not implemented.");
  }
}

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          }
        },
        JwtService,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
  })

  afterAll(() => {
    jest.clearAllMocks();
  })

  it('should be defined', () => {
    expect(authService).toBeDefined();
  })

  describe('createUser', () => {
    it('should encrypt password', async () => {
      jest.spyOn(userRepository,'create').mockReturnValue(mockUser);
      jest.spyOn(authService, <any>'generateJwt').mockReturnValue('token');
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue('hashedPassword');
      const user = {
        fullName: 'John Doe',
        email: 'test@test.com',
        password: '12345678',
      }
      await authService.create(user);
      expect(bcrypt.hashSync).toHaveBeenCalledWith('12345678', 10);
      expect(authService['generateJwt']).toHaveBeenCalledWith({ id: '123' });
    })

    it('should call userRepository.create with the correct params',async() => {
      jest.spyOn(userRepository,'create').mockReturnValue(mockUser);
      jest.spyOn(authService, <any>'generateJwt').mockReturnValue('token');
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue('hashedPassword');
      await authService.create({
        fullName: 'John Doe',
        email: 'test@test.com',
        password: '12345678',
      })
      expect(userRepository.save).toHaveBeenCalled()
    })

    it('should generate jwt token', async () => {
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue('hashedPassword');
      jest.spyOn(authService, <any>'generateJwt').mockReturnValue('token');
      jest.spyOn(userRepository,'create').mockReturnValue(mockUser);
      const user = {
        fullName: 'John Doe',
        email: 'test@test.com',
        password: '12345678',
      }
      await authService.create(user);
      expect(authService['generateJwt']).toHaveBeenCalledWith({ id: '123' });
    })
  })

  describe('login', () => {
    it('should call userRepository.findOne with the correct params', async() => {
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(authService, <any>'generateJwt').mockReturnValue('token');
      await authService.login({
        email: 'test@test.com',
        password: '12345678',
      })
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: 'test@test.com' }, select: { email: true, password: true }})
    })

    it('should throw BadRequestException if user does not exist', async() => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);
      try{
        await authService.login({email: '', password: ''})
      } catch (error) {
        expect(error.message).toBe('Invalid credentials');
      }
    })

    it('should throw BadRequestException if password is invalid', async() => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);
      try{
        await authService.login({email: '', password: ''})
      } catch (error) {
        expect(error.message).toBe('Invalid credentials');
      }
    })

    it('should generate jwt token', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
      jest.spyOn(authService, <any>'generateJwt').mockReturnValue('token');
      const result = await authService.login({email: 'test@test.com', password: 'password'})
      expect(authService['generateJwt']).toHaveBeenCalledWith({ id: '123' });
      expect(result.accessToken).toBe('token');
    })
  })
})