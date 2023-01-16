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
  temperature: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  userEmail: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  time: string;
}
