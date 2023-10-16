import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/auth/enums/roles.enum';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Auth(Roles.ADMIN)
  @Post()
  create(
    @Body() createSaleDto: CreateSaleDto,
    @GetUser() user: User
  ) {
    return this.salesService.create(createSaleDto, user);
  }

  @Auth(Roles.ADMIN)
  @Get()
  findAll() {
    return this.salesService.findAll();
  }

  @Auth(Roles.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @Auth(Roles.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string, 
    @GetUser() user: User
  ) {
    return this.salesService.update(id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesService.remove(+id);
  }
}
