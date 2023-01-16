import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UsernameDto {
  @IsString()
  @ApiProperty()
  name: string;
}
