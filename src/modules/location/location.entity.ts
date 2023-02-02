import { Location } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class LocationEntity implements Location {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}
