import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AttendanceDto {
  @IsString()
  @ApiProperty()
  userEmail: string;

  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty({ required: false })
  temperature: string;

  @IsString()
  @ApiProperty({ required: false })
  date?: string;

  @IsString()
  @ApiProperty({ required: false })
  location?: string;

  @IsString()
  @ApiProperty({ required: false })
  time?: string;
}
