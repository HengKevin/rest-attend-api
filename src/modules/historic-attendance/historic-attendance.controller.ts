import { Controller, Get, Res } from '@nestjs/common';
import { Body, Delete, Param, Post, Query } from '@nestjs/common/decorators';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { HistoricAttDto } from './dto/historic-attendance.dto';
import { HistoricAttendanceService } from './historic-attendance.service';
import { Response } from 'express';
import * as fs from 'fs';

@Controller('historic-attendance')
@ApiTags('historic-attendance')
export class HistoricAttendanceController {
  constructor(
    private readonly historicAttendanceService: HistoricAttendanceService,
  ) {}

  @Get()
  @ApiQuery({ name: 'page', required: false })
  async findAll(@Query('page') page) {
    return await this.historicAttendanceService.findAll(page);
  }

  @Get('/location/:location')
  findAllByLocation(@Param('location') location: string) {
    return this.historicAttendanceService.findAllByLocation(location);
  }

  @Get('/date/:date')
  findAllByDate(@Param('date') date: string) {
    return this.historicAttendanceService.findAllByDate(date);
  }

  @Get(':date/:userId')
  findAllByDateAndEmail(
    @Param('date') date: string,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.historicAttendanceService.findAllByDateAndId(date, userId);
  }

  @Get('/location/date/status')
  @ApiQuery({ name: 'date', required: false })
  @ApiQuery({ name: 'level', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false })
  findAllByLocationDateStatus(
    @Query('date') date?: string,
    @Query('level') level?: string,
    @Query('status') status?: string,
    @Query('page') page?: number,
  ) {
    if (date && location && status) {
      return this.historicAttendanceService.filterStatusByLevelDate(
        date,
        level,
        status,
        page,
      );
    } else if (date && level) {
      return this.historicAttendanceService.findAllByLevelDate(
        level,
        date,
        page,
      );
    } else {
      return this.historicAttendanceService.findAllByDate(date, page);
    }
  }

  @Get('/attendance/location/date/:date')
  summaryByLocationDate(@Param('date') date: string) {
    return this.historicAttendanceService.summaryByLocationDate(date);
  }

  @Get(':userId')
  findAllByUserEmail(@Param('userId', ParseIntPipe) userId: number) {
    return this.historicAttendanceService.findAllByUserId(userId);
  }

  @Get(':date/:userId')
  findOneByDateAndEmail(
    @Param('date') date: string,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.historicAttendanceService.findOneByDateAndId(date, userId);
  }

  @Get('/attendance/excel/location/date')
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'location', required: false })
  async excelByLocationDate(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('location') location: string,
    @Res() res: Response,
  ) {
    const exportPath =
      await this.historicAttendanceService.exportDataByLocationDateRange(
        startDate,
        endDate,
        location,
      );

    fs.promises
      .stat(exportPath)
      .then((stat) => {
        if (stat.isFile()) {
          res.download(exportPath, location + '.xlsx', (err) => {
            if (err) {
              console.log(err);
            } else {
              fs.unlinkSync(exportPath);
            }
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  @Get('/attendance/excel/:date')
  @ApiQuery({ name: 'date', required: false })
  async excel(@Query('date') date: string, @Res() res: Response) {
    const exportPath = await this.historicAttendanceService.exportDataByDate(
      date,
    );

    fs.promises
      .stat(exportPath)
      .then((stat) => {
        if (stat.isFile()) {
          res.download(exportPath, 'attendance.xlsx', (err) => {
            if (err) {
              console.log(err);
            } else {
              fs.unlinkSync(exportPath);
            }
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
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
