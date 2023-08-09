import { Controller, Get, ParseIntPipe, Post } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { AttendanceEntity as Attendance } from './attendance.entity';
import { ApiCreatedResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Body, Delete, Param, Query } from '@nestjs/common/decorators';
import { AttendanceDto } from './dto/attendance.dto';

@Controller('attendances')
@ApiTags('attendances')
export class AttendancesController {
  constructor(private readonly attendanceService: AttendancesService) { }

  @Get()
  @ApiQuery({ name: 'date', required: false })
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({ name: 'location', required: false })
  async findAttendances(
    @Query('date') date?: string,
    @Query('email') email?: string,
    @Query('location') location?: string,
  ) {
    if (date && location) {
      return await this.attendanceService.findAllByLocationAndDate(location, date);
    } else if (date) {
      return await this.attendanceService.findAllByDate(date);
    } else if (location) {
      return await this.attendanceService.findAllByLocation(location);
    } else if (email) {
      return await this.attendanceService.findAllByUserEmail(email);
    } else {
      return await this.attendanceService.findAll();
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
  async create(@Body() attendanceDto: AttendanceDto) {
    return await this.attendanceService.create(attendanceDto);
  }

  @Delete(':id')
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    return await this.attendanceService.deleteOne(id);
  }
}
