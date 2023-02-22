import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class AttendanceDto {
  @IsInt()
  @ApiProperty()
  userId: string;

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
  level?: string;

  @IsString()
  @ApiProperty({ required: false })
  time?: string;
}
