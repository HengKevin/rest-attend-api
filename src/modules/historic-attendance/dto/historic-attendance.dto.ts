import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class HistoricAttDto {
  @IsString()
  @ApiProperty({ required: false })
  date: string;

  @IsString()
  @ApiProperty({ required: false })
  attendanceStatus: string;

  @IsString()
  @ApiProperty({ required: false })
  checkOutStatus: string;

  @IsInt()
  @ApiProperty()
  userId: number;

  @IsString()
  @ApiProperty({ required: false })
  temperature: string;

  @IsString()
  @ApiProperty({ required: false })
  level: string;

  @IsString()
  @ApiProperty({ required: false })
  checkIn: string;

  @IsString()
  @ApiProperty({ required: false })
  checkOut: string;
}
