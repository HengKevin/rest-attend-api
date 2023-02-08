import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AdminDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  password: string;

  @ApiProperty()
  createdAt: Date;
}
