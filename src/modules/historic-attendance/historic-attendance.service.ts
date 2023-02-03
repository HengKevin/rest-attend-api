import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocationService } from '../location/location.service';
import { HistoricAttDto } from './dto/historic-attendance.dto';

@Injectable()
export class HistoricAttendanceService {
  constructor(
    private prisma: PrismaService,
    private location: LocationService,
  ) {}

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

  async markAbsentAttendance(
    date: string,
    userEmail: string,
    location: string,
  ) {
    return await this.prisma.historicAtt.create({
      data: {
        date: date,
        temperature: 'undefined',
        location: location,
        checkIn: 'undefined',
        checkOut: '--:--',
        attendanceStatus: 'Absent',
        userEmail: userEmail,
      },
    });
  }

  async summaryByLocationDate(date: string) {
    const location = await this.location.findAll();
    const summArr = [];
    for (const loc of location) {
      const res = await this.prisma.historicAtt.findMany({
        where: { AND: [{ date: date }, { location: loc.name }] },
      });

      const absent = res.filter((item) => item.attendanceStatus === 'Absent');
      const unusual_temp = res.filter(
        (item) => parseFloat(item.temperature) >= 37.5,
      );
      const summary = {
        location: loc.name,
        total: res.length,
        absent: absent.length,
        unusual_temp: unusual_temp.length,
      };
      summArr.push(summary);
    }
    return summArr;
  }

  async filterStatusByLocationDate(
    date?: string,
    location?: string,
    status?: string,
  ) {
    const res = await this.prisma.historicAtt.findMany({
      where: {
        AND: [
          { date: date },
          { attendanceStatus: status },
          { location: location },
        ],
      },
    });
    return res;
  }

  async findAllByLocationDate(location: string, date: string) {
    return await this.prisma.historicAtt.findMany({
      where: { AND: [{ location: location }, { date: date }] },
    });
  }
}
