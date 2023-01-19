import { Controller, Get, ParseIntPipe, Post } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { AttendanceEntity as Attendance } from './attendance.entity';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Body, Delete, Param } from '@nestjs/common/decorators';
import { AttendanceDto } from './dto/attendance.dto';

@Controller('attendances')
@ApiTags('attendances')
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

  @Get('/location/:location')
  @ApiCreatedResponse({ type: Attendance })
  findAllByLocation(@Param('location') location: string) {
    return this.attendanceService.findAllByLocation(location);
  }

  @Get('/date/:date')
  @ApiCreatedResponse({ type: Attendance })
  findAllByDate(@Param('date') date: string) {
    return this.attendanceService.findAllByDate(date);
  }

  @Get('/location/:location/date/:date')
  @ApiCreatedResponse({ type: Attendance })
  findAllByLocationAndDate(
    @Param('location') location: string,
    @Param('date') date: string,
  ) {
    return this.attendanceService.findAllByLocationAndDate(location, date);
  }

  @Delete(':id')
  @ApiCreatedResponse({ type: Attendance })
  deleteOne(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceService.deleteOne(id);
  }
}
