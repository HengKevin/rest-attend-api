import { HistoricAtt } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class HistoricEntity implements HistoricAtt {
  @ApiProperty()
  id: number;

  @ApiProperty()
  date: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  temperature: string;

  @ApiProperty()
  attendanceStatus: string;

  @ApiProperty()
  checkOutStatus: string;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  level: string;

  @ApiProperty()
  checkIn: string;

  @ApiProperty()
  checkOut: string;
}
