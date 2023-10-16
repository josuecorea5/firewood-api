import { PartialType } from '@nestjs/swagger';
import { CreateBuyingDto } from './create-buying.dto';

export class UpdateBuyingDto extends PartialType(CreateBuyingDto) {}
