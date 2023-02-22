import { Controller, Get, ParseIntPipe, Post } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { AttendanceEntity as Attendance } from './attendance.entity';
import { ApiCreatedResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Body, Delete, Param, Query } from '@nestjs/common/decorators';
import { AttendanceDto } from './dto/attendance.dto';

@Controller('attendances')
@ApiTags('attendances')
export class AttendancesController {
  constructor(private readonly attendanceService: AttendancesService) {}

  @Get()
  @ApiQuery({ name: 'date', required: false })
  @ApiQuery({ name: 'id', required: false })
  @ApiQuery({ name: 'level', required: false })
  findAttendances(
    @Query('date') date?: string,
    @Query('id') id?: string,
    @Query('level') level?: string,
  ) {
    if (date && location) {
      return this.attendanceService.findAllByLevelAndDate(level, date);
    } else if (date) {
      return this.attendanceService.findAllByDate(date);
    } else if (location) {
      return this.attendanceService.findAllByLevel(level);
    } else if (id) {
      return this.attendanceService.findAllByUserId(id);
    } else {
      return this.attendanceService.findAll();
    }
  }

  @Get('calculateAttendance/:date/:userId')
  @ApiCreatedResponse({ type: Attendance })
  async calculateAttendance(
    @Param('date') date: string,
    @Param('userId') userId: string,
  ) {
    return await this.attendanceService.calculateAttendance(date, userId);
  }

  @Post()
  create(@Body() attendanceDto: AttendanceDto) {
    return this.attendanceService.create(attendanceDto);
  }

  @Delete(':id')
  deleteOne(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceService.deleteOne(id);
  }
}
