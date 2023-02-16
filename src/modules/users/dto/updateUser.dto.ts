import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class updateUserDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  faceString: string;

  @IsString()
  @ApiProperty()
  level: string;

  @IsString()
  @ApiProperty()
  teacher: string;

  @IsString()
  @ApiProperty()
  fatherName: string;

  @IsString()
  @ApiProperty()
  fatherNumber: string;

  @IsString()
  @ApiProperty()
  fatherChatId: string;

  @IsString()
  @ApiProperty()
  motherName: string;

  @IsString()
  @ApiProperty()
  motherNumber: string;

  @IsString()
  @ApiProperty()
  motherChatId: string;

  @IsString()
  @ApiProperty()
  learningShift: string;
}
