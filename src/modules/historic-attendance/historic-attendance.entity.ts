import { HistoricAtt } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class HistoricEntity implements HistoricAtt {
  @ApiProperty()
  id: number;

  @ApiProperty()
  date: string;

  @ApiProperty()
  temperature: string;

  @ApiProperty()
  attendanceStatus: string;

  @ApiProperty()
  userEmail: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  checkIn: string;

  @ApiProperty()
  checkOut: string;
}
