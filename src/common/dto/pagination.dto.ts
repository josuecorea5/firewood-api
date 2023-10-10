import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
  @IsInt()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  offset?: number;
}