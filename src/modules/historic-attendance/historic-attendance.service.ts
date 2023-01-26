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

  async findAllByDateAndEmail(date: string, userEmail: string) {
    return await this.prisma.historicAtt.findUnique({
      where: { date_userEmail: { date, userEmail } },
    });
  }

  async findAllByDate(date: string) {
    const students = await this.prisma.users.findMany();
    students.forEach(async (student) => {
      const exist = await this.findAllByDateAndEmail(date, student.email);
      if (!exist) {
        await this.markAbsentAttendance(date, student.email);
      }
    });
    return await this.prisma.historicAtt.findMany({ where: { date } });
  }

  async delete(id: number) {
    return await this.prisma.historicAtt.delete({ where: { id } });
  }

  async findAllByLocation(location: string) {
    console.log(location);
    return await this.prisma.historicAtt.findMany({
      where: { location: location },
    });
  }

  async findOneByDateAndEmail(date: string, userEmail: string) {
    return await this.prisma.attendances.findMany({
      where: { AND: [{ date: date }, { userEmail: userEmail }] },
    });
  }

  async markAbsentAttendance(date: string, userEmail: string) {
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
