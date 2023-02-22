import { Users } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
export class UserEntity implements Users {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  faceString: string;

  @ApiProperty()
  level: string;

  @ApiProperty()
  teacher: string;

  @ApiProperty()
  fatherName: string;

  @ApiProperty()
  fatherNumber: string;

  @ApiProperty()
  fatherChatId: string;

  @ApiProperty()
  motherName: string;

  @ApiProperty()
  motherNumber: string;

  @ApiProperty()
  motherChatId: string;

  @ApiProperty()
  learningShift: string;

  @ApiProperty()
  checkIn: string;

  @ApiProperty()
  checkOut: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  attendanceStatus: string;
}
