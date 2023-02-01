import { Module } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { AttendancesController } from './attendances.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { HistoricAttendanceService } from '../historic-attendance/historic-attendance.service';

@Module({
  providers: [AttendancesService, PrismaService, HistoricAttendanceService],
  controllers: [AttendancesController],
})
export class AttendancesModule {}
