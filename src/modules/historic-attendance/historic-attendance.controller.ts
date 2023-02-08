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
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  async findAll(@Query('skip') skip = '00', @Query('take') take = '10') {
    return await this.historicAttendanceService.findAll(
      parseInt(skip),
      parseInt(take),
    );
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
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  findAllByLocationDateStatus(
    @Query('date') date?: string,
    @Query('location') location?: string,
    @Query('status') status?: string,
    @Query('skip') skip = '00',
    @Query('take') take = '10',
  ) {
    if (date && location && status) {
      return this.historicAttendanceService.filterStatusByLocationDate(
        date,
        location,
        status,
        parseInt(skip),
        parseInt(take),
      );
    } else if (date && location) {
      return this.historicAttendanceService.findAllByLocationDate(
        location,
        date,
        parseInt(skip),
        parseInt(take),
      );
    } else {
      return this.historicAttendanceService.findAllByDate(
        date,
        parseInt(skip),
        parseInt(take),
      );
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
