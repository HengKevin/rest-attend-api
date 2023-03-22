import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AttendancesModule } from './modules/attendances/attendances.module';
import { PrismaModule } from './prisma/prisma.module';
import { AttendanceRuleModule } from './modules/attendance-rule/attendance-rule.module';
import { HistoricAttendanceModule } from './modules/historic-attendance/historic-attendance.module';
import { LocationModule } from './modules/location/location.module';
import { ExcelModule } from './modules/excel/excel.module';
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './modules/admins/admins.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AttendancesModule,
    AttendanceRuleModule,
    HistoricAttendanceModule,
    LocationModule,
    ExcelModule,
    AuthModule,
    AdminsModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
