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
  userEmail: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  time: string;
}
