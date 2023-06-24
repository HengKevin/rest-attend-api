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
  async findAll() {
    return await this.historicAttendanceService.findAll();
  }

  @Get('/v2')
  async findAllPage() {
    return await this.historicAttendanceService.findAllPage();
  }

  @Get('/location/:location')
  findAllByLocation(@Param('location') location: string) {
    return this.historicAttendanceService.findAllByLocation(location);
  }

  @Get('/date/:date')
  findAllByDate(@Param('date') date: string) {
    try {
      return this.historicAttendanceService.findAllByDate(date);
    } catch (err) {
      return { message: err.message, status: 400 };
    }
  }

  @Get(':date/:userEmail')
  findAllByDateAndEmail(
    @Param('date') date: string,
    @Param('userEmail') userEmail: string,
  ) {
    try {
      return this.historicAttendanceService.findAllByDateAndEmail(
        date,
        userEmail,
      );
    } catch (err) {
      return { message: err.message, status: 400 };
    }
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
    try {
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
      } else if (date && status) {
        return this.historicAttendanceService.findAllByDateStatus(date, status);
      } else if (location && status) {
        return this.historicAttendanceService.findAllByLocationStatus(
          location,
          status,
        );
      } else if (location) {
        return this.historicAttendanceService.findAllByLocation(location);
      } else if (status) {
        return this.historicAttendanceService.findAllByStatus(status);
      } else {
        return this.historicAttendanceService.findAllByDate(date);
      }
    } catch (err) {
      return { message: err.message, status: 400 };
    }
  }

  @Get('/location/date/status/v2')
  @ApiQuery({ name: 'date', required: false })
  @ApiQuery({ name: 'location', required: false })
  @ApiQuery({ name: 'status', required: false })
  findAllByLocationDateStatusPagination(
    @Query('date') date?: string,
    @Query('location') location?: string,
    @Query('status') status?: string,
  ) {
    if (date && location && status) {
      return this.historicAttendanceService.filterStatusByLocationDatePage(
        date,
        location,
        status,
      );
    } else if (date && location) {
      return this.historicAttendanceService.findAllByLocationDatePage(
        location,
        date,
      );
    } else if (date && status) {
      return this.historicAttendanceService.findAllByDateStatusPage(
        date,
        status,
      );
    } else if (location && status) {
      return this.historicAttendanceService.findAllByLocationStatusPage(
        location,
        status,
      );
    } else {
      return this.historicAttendanceService.findAllByDatePage(date);
    }
  }

  @Get('/attendance/location/date/:date')
  summaryByLocationDate(@Param('date') date: string) {
    try {
      return this.historicAttendanceService.summaryByLocationDate(date);
    } catch (err) {
      return { message: err.message, status: 400 };
    }
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
    try {
      return this.historicAttendanceService.findOneByDateAndEmail(
        date,
        userEmail,
      );
    } catch (err) {
      return { message: err.message, status: 400 };
    }
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

    if (typeof exportPath === 'string') {
      return res.status(400).json({ error: exportPath });
    }

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
    try {
      const exportPath = await this.historicAttendanceService.exportDataByDate(
        date,
      );
      fs.promises
        .stat(exportPath)
        .then((stat) => {
          if (stat.isFile()) {
            res.download(exportPath, 'attendance.xlsx', (err) => {
              if (err) {
                return res.status(400).json({ error: err.message });
              } else {
                fs.unlinkSync(exportPath);
              }
            });
          }
        })
        .catch((err) => {
          return res.status(400).json({ error: err.message });
        });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  @Get('/attendance/excel/month/location')
  @ApiQuery({ name: 'month', required: false })
  @ApiQuery({ name: 'location', required: false })
  @ApiQuery({ name: 'year', required: false })
  async excelByMonthLocation(
    @Query('month') month: number,
    @Query('year') year: number,
    @Query('location') location: string,
    @Res() res: Response,
  ) {
    const exportPath =
      await this.historicAttendanceService.exportDataByLocationMonth(
        month,
        year,
        location,
      );

    if (typeof exportPath === 'string') {
      return res.status(400).json({ error: exportPath });
    }
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

  @Get('/odoo/attendance')
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  @ApiQuery({ name: 'users', required: true })
  async odooAttendance(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('users') users: string[],
    @Res() res: Response,
  ) {
    const exportPath =
      await this.historicAttendanceService.exportDataByDateRangeUsers(
        startDate,
        endDate,
        users,
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
