import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AttendanceRuleDto } from './dto/attendance-rule.dto';
import { UpdateAttendanceRuleDto } from './dto/update-attendance-rule.dto';

@Injectable()
export class AttendanceRuleService {
  constructor(private prisma: PrismaService) {}

  async create(rule: AttendanceRuleDto) {
    const valid = await this.validateRule(rule);
    if (valid.status === true) {
      const exist = await this.prisma.attendanceRule.findFirst();
      const avail = await this.prisma.attendanceRule.findMany();
      if (exist && avail.length > 0) {
        return this.update(exist.id, rule);
      } else {
        return await this.prisma.attendanceRule.create({ data: { ...rule } });
      }
    }
    return valid.message;
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
    const valid = await this.validateRule(rule);
    if (valid.status === false) {
      return valid.message;
    }
    return await this.prisma.attendanceRule.update({
      where: { id },
      data: { ...rule },
    });
  }

  async deleteOne(id: number) {
    const exists = await this.prisma.attendanceRule.findUnique({
      where: { id },
    });
    if (!exists) {
      return 'Attendance Rule does not exist';
    }
    return await this.prisma.attendanceRule.delete({ where: { id } });
  }

  async deleteAll() {
    return await this.prisma.attendanceRule.deleteMany();
  }

  async validateRule(dto: UpdateAttendanceRuleDto) {
    const earlyMinute = dto.earlyMinute;
    const lateMinute = dto.lateMinute;
    const offDutyTime = dto.offDutyTime;
    const onDutyTime = dto.onDutyTime;

    if (earlyMinute === '' || lateMinute === '') {
      return {
        message: 'earlyMinute and lateMinute must not be empty',
        status: false,
      };
    }

    if (typeof earlyMinute !== 'string' || typeof lateMinute !== 'string') {
      return {
        message: 'earlyMinute and lateMinute must be a number in a string',
        status: false,
      };
    }

    if (!Number(earlyMinute) || !Number(lateMinute)) {
      return {
        message: 'earlyMinute and lateMinute must be a number',
        status: false,
      };
    }

    if (!this.hasTimeFormat(offDutyTime) || !this.hasTimeFormat(onDutyTime)) {
      return {
        message: 'offDutyTime or onDutyTime must be a valid time',
        status: false,
      };
    }
    return { message: 'valid', status: true };
  }
}
