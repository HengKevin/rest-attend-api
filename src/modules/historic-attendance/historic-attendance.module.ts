import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocationService } from '../location/location.service';
import { HistoricAttendanceController } from './historic-attendance.controller';
import { HistoricAttendanceService } from './historic-attendance.service';

@Module({
  controllers: [HistoricAttendanceController],
  providers: [HistoricAttendanceService, PrismaService, LocationService],
})
export class HistoricAttendanceModule {}
