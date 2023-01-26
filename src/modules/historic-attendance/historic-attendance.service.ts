import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HistoricAttDto } from './dto/historic-attendance.dto';

@Injectable()
export class HistoricAttendanceService {
  constructor(private prisma: PrismaService) {}

  async create(history: HistoricAttDto) {
    return await this.prisma.historicAtt.create({ data: { ...history } });
  }

  async findAll() {
    return await this.prisma.historicAtt.findMany();
  }

  async findAllByUserEmail(userEmail: string) {
    return await this.prisma.historicAtt.findMany({ where: { userEmail } });
  }

  async findAllByDate(date: string) {
    const students = await this.prisma.users.findMany();
    students.forEach(async (student) => {
      const exist = await this.findAllByDateAndEmail(date, student.email);
      if (exist.length === 0) {
        await this.markAbsentAttendance(student.email);
      }
    });
    return await this.prisma.historicAtt.findMany({ where: { date } });
  }

  async findAllByDateAndEmail(date: string, userEmail: string) {
    const res = await this.prisma.historicAtt.findMany({
      where: { AND: [{ date: date }, { userEmail: userEmail }] },
    });
    return res;
  }
  async delete(id: number) {
    return await this.prisma.historicAtt.delete({ where: { id } });
  }

  async findAllByLocation(location: string) {
    return await this.prisma.historicAtt.findMany({ where: { location } });
  }

  async findOneByDateAndEmail(date: string, userEmail: string) {
    return await this.prisma.attendances.findMany({
      where: { AND: [{ date: date }, { userEmail: userEmail }] },
    });
  }

  async markAbsentAttendance(userEmail: string) {
    const currentDate = new Date();
    const date = currentDate
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      .split('/')
      .join('-');
    await this.prisma.historicAtt.create({
      data: {
        date: date,
        temperature: 'undefined',
        location: 'undefined',
        checkIn: 'undefined',
        checkOut: 'undefined',
        attendanceStatus: 'Absent',
        userEmail: userEmail,
      },
    });
  }
}
