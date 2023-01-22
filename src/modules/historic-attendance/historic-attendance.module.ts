import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HistoricAttendanceController } from './historic-attendance.controller';
import { HistoricAttendanceService } from './historic-attendance.service';

@Module({
  controllers: [HistoricAttendanceController],
  providers: [HistoricAttendanceService, PrismaService],
})
export class HistoricAttendanceModule {}
