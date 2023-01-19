import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateAttendanceRuleDto {
  @IsString()
  @ApiProperty({ required: false })
  earlyMinute: string;

  @IsString()
  @ApiProperty({ required: false })
  lateMinute: string;

  @IsString()
  @ApiProperty({ required: false })
  offDutyTime: string;

  @IsString()
  @ApiProperty({ required: false })
  onDutyTime: string;
}
