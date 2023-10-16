import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { BuyingsService } from './buyings.service';
import { CreateBuyingDto } from './dto/create-buying.dto';
import { UpdateBuyingDto } from './dto/update-buying.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/auth/enums/roles.enum';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('buyings')
@ApiBearerAuth()
@Controller('buyings')
export class BuyingsController {
  constructor(private readonly buyingsService: BuyingsService) {}

  @Auth(Roles.ADMIN)
  @Post()
  create(
    @Body() createBuyingDto: CreateBuyingDto,
    @GetUser() user: User
    ) {
    return this.buyingsService.create(createBuyingDto, user);
  }

  @Auth(Roles.ADMIN)
  @Get()
  findAll() {
    return this.buyingsService.findAll();
  }

  @Auth(Roles.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.buyingsService.findOne(id);
  }

  @Auth(Roles.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateBuyingDto: UpdateBuyingDto,
    @GetUser() user: User
    ) {
    return this.buyingsService.update(id, updateBuyingDto, user);
  }
}
