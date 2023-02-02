import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AttendancesService } from '../attendances/attendances.service';
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
    const his = await this.prisma.historicAtt.findMany({ where: { date } });
    return his;
  }

  async delete(id: number) {
    return await this.prisma.historicAtt.delete({ where: { id } });
  }

  async findAllByLocation(location: string) {
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
    return await this.prisma.historicAtt.create({
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

  async summaryByLocationDate(date: string) {
    const location = 'Borey M49';
    const res = await this.prisma.historicAtt.findMany({
      where: { AND: [{ date: date }, { location: location }] },
    });

    const late = res.filter((item) => item.attendanceStatus === 'Late');
    const unusual_temp = res.filter(
      (item) => parseFloat(item.temperature) >= 37.5,
    );
    const summary = {
      location: location,
      total: res.length,
      late: late.length,
      unusual_temp: unusual_temp.length,
    };
    return summary;
  }
}
