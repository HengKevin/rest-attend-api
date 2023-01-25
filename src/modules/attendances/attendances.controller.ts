import { Controller, Get, ParseIntPipe, Post } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { AttendanceEntity as Attendance } from './attendance.entity';
import { ApiCreatedResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Body, Delete, Param, Patch, Query } from '@nestjs/common/decorators';
import { AttendanceDto } from './dto/attendance.dto';

@Controller('attendances')
@ApiTags('attendances')
export class AttendancesController {
  constructor(private readonly attendanceService: AttendancesService) {}

  @Get()
  @ApiQuery({ name: 'date', required: false })
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({ name: 'location', required: false })
  findAttendances(
    @Query('date') date?: string,
    @Query('email') email?: string,
    @Query('location') location?: string,
  ) {
    if (date && location) {
      return this.attendanceService.findAllByLocationAndDate(location, date);
    } else if (date) {
      return this.attendanceService.findAllByDate(date);
    } else if (location) {
      return this.attendanceService.findAllByLocation(location);
    } else if (email) {
      return this.attendanceService.findAllByUserEmail(email);
    } else {
      return this.attendanceService.findAll();
    }
  }

  @Get('calculateAttendance/:date/:userEmail')
  @ApiCreatedResponse({ type: Attendance })
  async calculateAttendance(
    @Param('date') date: string,
    @Param('userEmail') userEmail: string,
  ) {
    return await this.attendanceService.calculateAttendance(date, userEmail);
  }

  @Post()
  create(@Body() attendanceDto: AttendanceDto) {
    return this.attendanceService.create(attendanceDto);
  }

  @Patch('calculateAttendanceStatus/:date/:userEmail')
  @ApiCreatedResponse({ type: Attendance })
  async calculateAttendanceStatus(
    @Param('date') date: string,
    @Param('userEmail') userEmail: string,
  ) {
    return await this.attendanceService.calculateAttendanceStatus(
      date,
      userEmail,
    );
  }

  @Delete(':id')
  deleteOne(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceService.deleteOne(id);
  }
}
