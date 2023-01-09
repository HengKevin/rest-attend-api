import { Attendances, Users } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AttendanceEntity implements Attendances {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  temperature: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  userEmail: string;

  @ApiProperty()
  location: string;
}
