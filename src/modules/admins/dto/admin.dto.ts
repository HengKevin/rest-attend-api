import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AdminDto {
  @IsString()
  @ApiProperty()
  username: string;

  @IsString()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  createBy: string;

  @ApiProperty()
  createdAt: Date;
}
