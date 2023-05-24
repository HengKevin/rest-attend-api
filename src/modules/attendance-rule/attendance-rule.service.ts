import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AttendanceRuleDto } from './dto/attendance-rule.dto';
import { UpdateAttendanceRuleDto } from './dto/update-attendance-rule.dto';

@Injectable()
export class AttendanceRuleService {
  constructor(private prisma: PrismaService) {}

  async create(rule: AttendanceRuleDto) {
    try {
      const patternNumFormat = /^-?\d*\.?\d+$/;
      console.log('earlyMinute IsNumber :', patternNumFormat.test(rule.earlyMinute));
      console.log('lateMinute IsNumber :', patternNumFormat.test(rule.lateMinute));
      if (!patternNumFormat.test(rule.earlyMinute) && !patternNumFormat.test(rule.lateMinute)) {
        throw new Error('Both earlyMinute and lateMinute are not in string of number')
      }
      else if(!patternNumFormat.test(rule.earlyMinute) || !patternNumFormat.test(rule.lateMinute))  {
        throw new Error('One or both earlyMinute and lateMinute are not in string of number')
      }
      const patternTimeFormat = /^([01]\d|2[0-3]):[0-5]\d$/;
      console.log('onDutyTime IsNumber :', patternTimeFormat.test(rule.onDutyTime));
      console.log('offDutyTime IsNumber :', patternTimeFormat.test(rule.offDutyTime));
      if (!patternTimeFormat.test(rule.onDutyTime) && !patternTimeFormat.test(rule.offDutyTime)) {
        throw new Error ('Both onDutyTime and offDutyTime are not in the correct 24-hour format.');
      }
      else if(!patternTimeFormat.test(rule.onDutyTime) || !patternTimeFormat.test(rule.offDutyTime))  {
        throw new Error ('One or both onDutyTime and offDutyTime are not in the correct 24-hour format.');
      }
      return await this.prisma.attendanceRule.create({ data: { ...rule } });
    } catch (error) {
      console.log("Error : ", error.message);
      return {message: error.message, status: false}
    }
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
