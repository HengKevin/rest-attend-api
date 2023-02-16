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

  async findAll(page = 1) {
    const total = await this.prisma.historicAtt.count();
    const pages = Math.ceil(total / 10);
    const res = await this.prisma.historicAtt.findMany({
      take: 10,
      skip: 10 * (page - 1),
    });
    return {
      data: res,
      pagination: {
        totalData: total,
        totalPages: pages,
        dataPerPage: total / pages,
      },
    };
  }

  async findAllByUserId(id: number) {
    return await this.prisma.historicAtt.findMany({ where: { id } });
  }

  async findAllByDateAndId(date: string, id: number) {
    return await this.prisma.historicAtt.findUnique({
      where: { date_userId: { date: date, userId: id } },
    });
  }

  async findAllByDate(date: string, page = 1) {
    const total = await this.prisma.historicAtt.count({ where: { date } });
    const pages = Math.ceil(total / 10);
    const his = await this.prisma.historicAtt.findMany({
      where: { date },
      take: 10,
      skip: 10 * (page - 1),
    });
    return {
      data: his,
      pagination: {
        totalData: total,
        totalPages: pages,
        dataPerPage: total / pages,
      },
    };
  }

  async delete(id: number) {
    return await this.prisma.historicAtt.delete({ where: { id } });
  }

  async findAllByLocation(level: string) {
    return await this.prisma.historicAtt.findMany({
      where: { level: level },
    });
  }

  async findOneByDateAndId(date: string, id: number) {
    return await this.prisma.attendances.findMany({
      where: { AND: [{ date: date }, { id: id }] },
    });
  }

  async markAbsentAttendance(
    date: string,
    userId: number,
    level: string,
    name: string,
  ) {
    return await this.prisma.historicAtt.create({
      data: {
        date: date,
        level: level,
        checkIn: '--:--',
        checkOut: '--:--',
        temperature: '0',
        attendanceStatus: 'Absent',
        checkOutStatus: 'undefined',
        userId: userId,
        name: name,
      },
    });
  }

  async summaryByLocationDate(date: string) {
    const level = await this.location.findAll();
    const summArr = [];
    for (const loc of level) {
      const res = await this.prisma.historicAtt.findMany({
        where: { AND: [{ date: date }, { level: loc.name }] },
      });

      const absent = res.filter((item) => item.attendanceStatus === 'Absent');
      const summary = {
        location: loc.name,
        total: res.length,
        absent: absent.length,
      };
      summArr.push(summary);
    }
    return summArr;
  }

  async filterStatusByLocationDate(
    date?: string,
    level?: string,
    status?: string,
    page = 1,
  ) {
    const total = await this.prisma.historicAtt.count({
      where: { date: date },
    });
    const pages = Math.ceil(total / 10);
    const res = await this.prisma.historicAtt.findMany({
      where: {
        AND: [{ date: date }, { attendanceStatus: status }, { level: level }],
      },
      take: 10,
      skip: 10 * (page - 1),
    });
    return {
      data: res,
      pagination: {
        totalData: total,
        totalPages: pages,
        dataPerPage: total / pages,
      },
    };
  }

  async findAllByLevelDate(level: string, date: string, page = 1) {
    return await this.prisma.historicAtt.findMany({
      where: { AND: [{ level: level }, { date: date }] },
      take: 10,
      skip: 10 * (page - 1),
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
    level: string,
  ) {
    const data = [];
    const users = await this.prisma.users.findMany({
      where: { level: level },
    });
    for (const user of users) {
      const early = await this.prisma.historicAtt.count({
        where: {
          AND: [
            { attendanceStatus: 'Early' },
            { date: { gte: startDate } },
            { date: { lte: endDate } },
            { userId: user.id },
            { level: level },
          ],
        },
      });
      const late = await this.prisma.historicAtt.count({
        where: {
          AND: [
            { attendanceStatus: 'Late' },
            { date: { gte: startDate } },
            { date: { lte: endDate } },
            { userId: user.id },
            { level: level },
          ],
        },
      });
      const absent = await this.prisma.historicAtt.count({
        where: {
          AND: [
            { attendanceStatus: 'Absent' },
            { date: { gte: startDate } },
            { date: { lte: endDate } },
            { userId: user.id },
            { level: level },
          ],
        },
      });
      data.push({
        date: startDate + ' - ' + endDate,
        name: user.name,
        id: user.id,
        early: early,
        late: late,
        absent: absent,
      });
    }
    const res = await this.excel.downloadExcelByLocation(data, level);
    return res;
  }
}
