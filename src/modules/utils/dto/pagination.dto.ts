import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ required: false })
  @IsInt()
  @Min(1)
  page = 1;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(1)
  limit: 10;
}
