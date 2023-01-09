import { Controller, Get, Post } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { AttendanceEntity as Attendance } from './attendance.entity';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { Body } from '@nestjs/common/decorators';
import { AttendanceDto } from './dto/attendance.dto';

@Controller('attendances')
export class AttendancesController {
  constructor(private readonly attendanceService: AttendancesService) {}

  @Get()
  findAll() {
    return this.attendanceService.findAll();
  }

  @Post()
  @ApiCreatedResponse({ type: Attendance })
  create(@Body() attendanceDto: AttendanceDto) {
    return this.attendanceService.create(attendanceDto);
  }
}
