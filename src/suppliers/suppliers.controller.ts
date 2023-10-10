import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/auth/enums/roles.enum';
import { PaginationDto } from 'src/common/dto/pagination.dto';

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
  findOne(@Param('term') term: string) {
    return this.suppliersService.findOne(term);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSupplierDto: UpdateSupplierDto) {
    return this.suppliersService.update(+id, updateSupplierDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.suppliersService.remove(+id);
  }
}
