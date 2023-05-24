import { Module } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { AttendancesController } from './attendances.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { HistoricAttendanceService } from '../historic-attendance/historic-attendance.service';
import { LocationService } from '../location/location.service';
import { ExcelService } from '../excel/excel.service';
import { UsersService } from '../users/users.service';

@Module({
  providers: [
    AttendancesService,
    PrismaService,
    HistoricAttendanceService,
    LocationService,
    ExcelService,
    UsersService,
  ],
  controllers: [AttendancesController],
})
export class AttendancesModule {}
