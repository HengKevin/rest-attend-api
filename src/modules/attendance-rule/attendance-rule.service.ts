import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AttendanceRuleDto } from './dto/attendance-rule.dto';
import { UpdateAttendanceRuleDto } from './dto/update-attendance-rule.dto';

@Injectable()
export class AttendanceRuleService {
  constructor(private prisma: PrismaService) {}

  async create(rule: AttendanceRuleDto) {
    const earlyMinute = rule.earlyMinute;
    const lateMinute = rule.lateMinute;
    const offDutyTime = rule.offDutyTime;
    const onDutyTime = rule.onDutyTime;

    if (!Number(earlyMinute) || !Number(lateMinute)) {
      return 'earlyMinute and lateMinute must be a number';
    }

    if (!this.hasTimeFormat(offDutyTime) || !this.hasTimeFormat(onDutyTime)) {
      return 'offDutyTime or onDutyTime must be a valid time';
    }
    const exist = await this.prisma.attendanceRule.findFirst();
    const avail = await this.prisma.attendanceRule.findMany();
    if (exist && avail.length > 0) {
      return this.update(exist.id, rule);
    } else {
      return await this.prisma.attendanceRule.create({ data: { ...rule } });
    }
  }

  hasTimeFormat(str: string): boolean {
    const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
    return timeRegex.test(str);
  }

  async findAll() {
    return await this.prisma.attendanceRule.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.attendanceRule.findUnique({ where: { id } });
  }

  async update(id: number, rule: UpdateAttendanceRuleDto) {
    return await this.prisma.attendanceRule.update({
      where: { id },
      data: { ...rule },
    });
  }

  async deleteOne(id: number) {
    return await this.prisma.attendanceRule.delete({ where: { id } });
  }

  async deleteAll() {
    return await this.prisma.attendanceRule.deleteMany();
  }
}
