import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/auth/enums/roles.enum';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('suppliers')
@ApiBearerAuth()
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Auth(Roles.ADMIN)
  @Post()
  create(
    @Body() createSupplierDto: CreateSupplierDto,
    @GetUser() user: User
    ) {
    return this.suppliersService.create(createSupplierDto, user);
  }

  @Auth(Roles.ADMIN)
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.suppliersService.findAll(paginationDto);
  }

  @Auth(Roles.ADMIN)
  @Get(':term')
  @ApiParam({name: 'term', type: String, description: 'Term could be supplier name or supplierId'})
  findOne(@Param('term') term: string) {
    return this.suppliersService.findOne(term);
  }

  @Auth(Roles.ADMIN)
  @Patch(':id')
  @ApiBody({type: UpdateSupplierDto})
  update(
    @Param('id') id: string, @Body() updateSupplierDto: UpdateSupplierDto,
    @GetUser() user: User
    ) {
    return this.suppliersService.update(id, updateSupplierDto, user);
  }

  @Auth(Roles.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.suppliersService.remove(id);
  }
}
