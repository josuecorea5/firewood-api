import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  private readonly logger = new Logger();

  async create(registerDto: RegisterDto) {
    try {
      const { password, ...userData } = registerDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      })

      await this.userRepository.save(user);
      delete user.password;

      return {
        ...user,
        accessToken: this.generateJwt({ id: user.id })
      }
      
    } catch (error) {
      this.handleDbException(error);
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email}, select: { email: true, password: true}});

    if(!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if(!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    return {
      ...user,
      accessToken: this.generateJwt({ id: user.id })
    }
  }

  private generateJwt(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDbException(error: any) {
    if(error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
  }
}
