import { Module } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { AttendancesController } from './attendances.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { HistoricAttendanceService } from '../historic-attendance/historic-attendance.service';
import { LocationService } from '../location/location.service';

@Module({
  providers: [
    AttendancesService,
    PrismaService,
    HistoricAttendanceService,
    LocationService,
  ],
  controllers: [AttendancesController],
})
export class AttendancesModule {}
