import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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
    throw new HttpException(valid.message, HttpStatus.BAD_REQUEST);
  }

  async newRule(rule: AttendanceRuleDto) {
    const valid = await this.validateRule(rule);
    if (valid.status === true) {
      const exist = await this.prisma.attendanceRule.findMany();
      if (exist.length > 0) {
        return this.update(exist[0].id, rule);
      } else {
        return await this.prisma.attendanceRule.create({ data: { ...rule } });
      }
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
    const rule = await this.prisma.attendanceRule.findUnique({ where: { id } });
    if (!rule) {
      throw new HttpException('Attendance Rule does not exist', 400);
    }
    return rule;
  }

  async update(id: number, rule: UpdateAttendanceRuleDto) {
    const valid = await this.validateRule(rule);
    if (valid.status === false) {
      throw new HttpException(valid.message, HttpStatus.BAD_REQUEST);
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
      throw new HttpException('Attendance Rule does not exist', 400);
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
