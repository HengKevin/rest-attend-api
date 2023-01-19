import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AttendanceRuleController } from './attendance-rule.controller';
import { AttendanceRuleService } from './attendance-rule.service';

@Module({
  controllers: [AttendanceRuleController],
  providers: [AttendanceRuleService, PrismaService],
})
export class AttendanceRuleModule {}
