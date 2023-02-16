import { Attendances } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AttendanceEntity implements Attendances {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  date: string;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  temperature: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  level: string;

  @ApiProperty()
  time: string;
}
