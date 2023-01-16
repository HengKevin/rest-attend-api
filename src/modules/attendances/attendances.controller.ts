import { Controller, Get, ParseIntPipe, Post } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { AttendanceEntity as Attendance } from './attendance.entity';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { Body, Delete, Param } from '@nestjs/common/decorators';
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

  @Get(':email')
  @ApiCreatedResponse({ type: Attendance })
  findAllByUserEmail(@Param('email') email: string) {
    return this.attendanceService.findAllByUserEmail(email);
  }

  @Get('/date/:date')
  @ApiCreatedResponse({ type: Attendance })
  findAllByDate(@Param('date') date: string) {
    return this.attendanceService.findAllByDate(date);
  }

  @Delete(':id')
  @ApiCreatedResponse({ type: Attendance })
  deleteOne(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceService.deleteOne(id);
  }
}
