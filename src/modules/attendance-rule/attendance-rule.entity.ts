import { ApiProperty } from '@nestjs/swagger';
import { AttendanceRule } from '@prisma/client';

export class AttendanceRuleEntity implements AttendanceRule {
  @ApiProperty()
  id: number;

  @ApiProperty()
  earlyMinute: string;

  @ApiProperty()
  lateMinute: string;

  @ApiProperty()
  offDutyTime: string;

  @ApiProperty()
  onDutyTime: string;
}
