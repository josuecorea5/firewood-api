import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/auth/enums/roles.enum';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('inventory')
@ApiBearerAuth()
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Auth(Roles.ADMIN)
  @Post()
  create(
    @Body() createInventoryDto: CreateInventoryDto,
    @GetUser() user: User
  ) {
    return this.inventoryService.create(createInventoryDto, user);
  }

  @Auth(Roles.ADMIN)
  @Get()
  findAll() {
    return this.inventoryService.findAll();
  }

  @Auth(Roles.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Auth(Roles.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateInventoryDto: UpdateInventoryDto,
    @GetUser() user: User
  ) {
    return this.inventoryService.update(id, updateInventoryDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(id);
  }
}
