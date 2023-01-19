import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AttendanceRuleDto } from './dto/attendance-rule.dto';
import { UpdateAttendanceRuleDto } from './dto/update-attendance-rule.dto';

@Injectable()
export class AttendanceRuleService {
  constructor(private prisma: PrismaService) {}

  async create(rule: AttendanceRuleDto) {
    return await this.prisma.attendanceRule.create({ data: { ...rule } });
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
