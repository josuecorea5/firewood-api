import { PartialType } from '@nestjs/mapped-types';
import { CreateBuyingDto } from './create-buying.dto';

export class UpdateBuyingDto extends PartialType(CreateBuyingDto) {}
