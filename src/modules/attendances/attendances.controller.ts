import { Controller, Get, ParseIntPipe, Post } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { AttendanceEntity as Attendance } from './attendance.entity';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Body, Delete, Param, Patch } from '@nestjs/common/decorators';
import { AttendanceDto } from './dto/attendance.dto';

@Controller('attendances')
@ApiTags('attendances')
export class AttendancesController {
  constructor(private readonly attendanceService: AttendancesService) {}

  @Get()
  findAll() {
    return this.attendanceService.findAll();
  }

  // @Get(':date/:userEmail')
  // @ApiCreatedResponse({ type: Attendance })
  // async findAllByDateAndEmail(
  //   @Param('date') date: string,
  //   @Param('userEmail') userEmail: string,
  // ) {
  //   const res = await this.attendanceService.findAllByDateAndEmail(
  //     date,
  //     userEmail,
  //   );
  //   return res;
  // }

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

  @Get(':date')
  findAllByDate(@Param('date') date: string) {
    return this.attendanceService.findAllByDate(date);
  }

  @Get(':email')
  findAllByUserEmail(@Param('email') email: string) {
    return this.attendanceService.findAllByUserEmail(email);
  }

  @Get(':location')
  findAllByLocation(@Param('location') location: string) {
    console.log('Hello');
    return this.attendanceService.findAllByLocation(location);
  }

  @Get(':location/:date')
  findAllByLocationAndDate(
    @Param('location') location: string,
    @Param('date') date: string,
  ) {
    return this.attendanceService.findAllByLocationAndDate(location, date);
  }

  @Delete(':id')
  deleteOne(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceService.deleteOne(id);
  }
}
