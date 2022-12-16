import { IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationParams {
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  pageSize: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageIndex: number;
}
