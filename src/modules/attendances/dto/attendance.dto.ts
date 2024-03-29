import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AttendanceDto {
  @IsString()
  @ApiProperty({ required: false })
  status: string;

  @IsString()
  @ApiProperty()
  userEmail: string;

  @IsString()
  @ApiProperty({ required: false })
  date?: string;

  @IsString()
  @ApiProperty({ required: false })
  location?: string;

  @IsString()
  @ApiProperty({ required: false })
  time?: string;

  @IsString()
  @ApiProperty({ required: false })
  temperature?: string;
}
