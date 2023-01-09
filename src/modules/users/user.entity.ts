import { Users } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
export class UserEntity implements Users {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  faceString: string;

  @ApiProperty()
  createdAt: Date;
}
