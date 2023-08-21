import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateSuperAdminDto {
    @IsString()
    @ApiProperty()
    username: string;
  
    @IsString()
    @ApiProperty()
    email: string;
  
    @IsString()
    @ApiProperty()
    password: string;
  
    @ApiProperty()
    createdAt: Date;
  }
  