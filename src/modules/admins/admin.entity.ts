import { ApiProperty } from '@nestjs/swagger';
import { Admin } from '@prisma/client';

export class AdminEntity implements Admin {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  createdAt: Date;
}
