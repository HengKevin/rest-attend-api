import { Controller, Get } from '@nestjs/common';
import { Body, Delete, Param, Post, Query } from '@nestjs/common/decorators';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { HistoricAttDto } from './dto/historic-attendance.dto';
import { HistoricAttendanceService } from './historic-attendance.service';

@Controller('historic-attendance')
@ApiTags('historic-attendance')
export class HistoricAttendanceController {
  constructor(
    private readonly historicAttendanceService: HistoricAttendanceService,
  ) {}

  @Get()
  findAll() {
    return this.historicAttendanceService.findAll();
  }

  @Get('/location/:location')
  findAllByLocation(@Param('location') location: string) {
    return this.historicAttendanceService.findAllByLocation(location);
  }

  @Get('/date/:date')
  findAllByDate(@Param('date') date: string) {
    return this.historicAttendanceService.findAllByDate(date);
  }

  @Get(':date/:userEmail')
  findAllByDateAndEmail(
    @Param('date') date: string,
    @Param('userEmail') userEmail: string,
  ) {
    return this.historicAttendanceService.findAllByDateAndEmail(
      date,
      userEmail,
    );
  }

  @Get('/location/date/status')
  @ApiQuery({ name: 'date', required: false })
  @ApiQuery({ name: 'location', required: false })
  @ApiQuery({ name: 'status', required: false })
  findAllByLocationDateStatus(
    @Query('date') date?: string,
    @Query('location') location?: string,
    @Query('status') status?: string,
  ) {
    if (date && location && status) {
      return this.historicAttendanceService.filterStatusByLocationDate(
        date,
        location,
        status,
      );
    } else if (date && location) {
      return this.historicAttendanceService.findAllByLocationDate(
        location,
        date,
      );
    } else {
      return this.historicAttendanceService.findAllByDate(date);
    }
  }

  @Get('/attendance/location/date/:date')
  summaryByLocationDate(@Param('date') date: string) {
    return this.historicAttendanceService.summaryByLocationDate(date);
  }

  @Get(':userEmail')
  findAllByUserEmail(@Param('userEmail') userEmail: string) {
    return this.historicAttendanceService.findAllByUserEmail(userEmail);
  }

  @Get(':date/:userEmail')
  findOneByDateAndEmail(
    @Param('date') date: string,
    @Param('userEmail') userEmail: string,
  ) {
    return this.historicAttendanceService.findOneByDateAndEmail(
      date,
      userEmail,
    );
  }

  @Post()
  create(@Body() historicAttendanceDto: HistoricAttDto) {
    return this.historicAttendanceService.create(historicAttendanceDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.historicAttendanceService.delete(id);
  }
}
