import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExcelService } from '../excel/excel.service';
import { LocationService } from '../location/location.service';
import { HistoricAttDto } from './dto/historic-attendance.dto';

@Injectable()
export class HistoricAttendanceService {
  constructor(
    private prisma: PrismaService,
    private location: LocationService,
    private excel: ExcelService,
  ) {}

  async create(history: HistoricAttDto) {
    return await this.prisma.historicAtt.create({ data: { ...history } });
  }

  async findAll(skip?: number, take?: number) {
    return await this.prisma.historicAtt.findMany({ skip, take });
  }

  async findAllByUserEmail(userEmail: string) {
    return await this.prisma.historicAtt.findMany({ where: { userEmail } });
  }

  async findAllByDateAndEmail(date: string, userEmail: string) {
    return await this.prisma.historicAtt.findUnique({
      where: { date_userEmail: { date, userEmail } },
    });
  }

  async findAllByDate(date: string, skip?: number, take?: number) {
    const his = await this.prisma.historicAtt.findMany({
      where: { date },
      skip,
      take,
    });
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
        checkIn: '--:--',
        checkOut: '--:--',
        attendanceStatus: 'Absent',
        checkOutStatus: 'undefined',
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
    skip?: number,
    take?: number,
  ) {
    const res = await this.prisma.historicAtt.findMany({
      where: {
        AND: [
          { date: date },
          { attendanceStatus: status },
          { location: location },
        ],
      },
      skip,
      take,
    });
    return res;
  }

  async findAllByLocationDate(
    location: string,
    date: string,
    skip?: number,
    take?: number,
  ) {
    return await this.prisma.historicAtt.findMany({
      where: { AND: [{ location: location }, { date: date }] },
      skip,
      take,
    });
  }

  async exportDataByDate(date: string) {
    const data = await this.prisma.historicAtt.findMany({
      where: { date: date },
    });
    const res = await this.excel.dowloadExcel(data);
    return res;
  }

  async exportDataByLocationDateRange(
    startDate: string,
    endDate: string,
    location: string,
  ) {
    const data = [];
    const users = await this.prisma.users.findMany({
      where: { location: location },
    });
    for (const user of users) {
      const early = await this.prisma.historicAtt.count({
        where: {
          AND: [
            { attendanceStatus: 'Early' },
            { date: { gte: startDate } },
            { date: { lte: endDate } },
            { userEmail: user.email },
            { location: location },
          ],
        },
      });
      const late = await this.prisma.historicAtt.count({
        where: {
          AND: [
            { attendanceStatus: 'Late' },
            { date: { gte: startDate } },
            { date: { lte: endDate } },
            { userEmail: user.email },
            { location: location },
          ],
        },
      });
      const absent = await this.prisma.historicAtt.count({
        where: {
          AND: [
            { attendanceStatus: 'Absent' },
            { date: { gte: startDate } },
            { date: { lte: endDate } },
            { userEmail: user.email },
            { location: location },
          ],
        },
      });
      data.push({
        date: startDate + ' - ' + endDate,
        name: user.name,
        email: user.email,
        early: early,
        late: late,
        absent: absent,
      });
    }
    const res = await this.excel.downloadExcelByLocation(data, location);
    return res;
  }
}
