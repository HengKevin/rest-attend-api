import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AttendancesModule } from './modules/attendances/attendances.module';
import { PrismaModule } from './prisma/prisma.module';
import { AttendanceRuleModule } from './modules/attendance-rule/attendance-rule.module';
import { HistoricAttendanceModule } from './modules/historic-attendance/historic-attendance.module';
import { LocationModule } from './modules/location/location.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AttendancesModule,
    AttendanceRuleModule,
    HistoricAttendanceModule,
    LocationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
