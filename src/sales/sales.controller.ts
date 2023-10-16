import { Controller, Get, Post, Body, Patch, Param, HttpStatus } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/auth/enums/roles.enum';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('sales')
@ApiBearerAuth()
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

  @ApiResponse({status: HttpStatus.OK, description: 'Cancel a sale'})
  @Auth(Roles.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string, 
    @GetUser() user: User
  ) {
    return this.salesService.update(id, user);
  }
}
