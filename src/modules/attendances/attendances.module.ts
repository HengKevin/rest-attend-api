import { Module } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { AttendancesController } from './attendances.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { HistoricAttendanceService } from '../historic-attendance/historic-attendance.service';
import { LocationService } from '../location/location.service';
import { ExcelService } from '../excel/excel.service';
import { UtilService } from '../util/util.service';
import { AttendanceRuleService } from '../attendance-rule/attendance-rule.service';

@Module({
  providers: [
    AttendancesService,
    PrismaService,
    HistoricAttendanceService,
    LocationService,
    ExcelService,
    UtilService,
    AttendanceRuleService,
  ],
  controllers: [AttendancesController],
})
export class AttendancesModule {}
