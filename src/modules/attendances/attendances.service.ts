import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AttendanceDto } from './dto/attendance.dto';
import { HistoricAttendanceService } from '../historic-attendance/historic-attendance.service';
import * as moment from 'moment';

@Injectable()
export class AttendancesService {
  constructor(
    private prisma: PrismaService,
    private hist: HistoricAttendanceService,
  ) {}

  async create(attendance: AttendanceDto) {
    const students = await this.prisma.users.findMany();
    for (const student of students) {
      const exist = await this.hist.findAllByDateAndEmail(
        attendance.date,
        student.email,
      );
      if (!exist) {
        await this.hist.markAbsentAttendance(
          attendance.date,
          student.email,
          student.location,
          student.name,
        );
      }
    }
    const res = await this.prisma.attendances.create({
      data: { ...attendance },
    });
    await this.calculateAttendance(attendance.date, attendance.userEmail);
    return res;
  }

  async findAll() {
    return this.prisma.attendances.findMany();
  }

  async findAllByUserEmail(userEmail: string) {
    return await this.prisma.attendances.findMany({ where: { userEmail } });
  }

  async findAllByDate(date: string) {
    return await this.prisma.attendances.findMany({ where: { date } });
  }

  async findAllByDateAndEmail(date: string, userEmail: string) {
    const res = await this.prisma.attendances.findMany({
      where: { AND: [{ date: date }, { userEmail: userEmail }] },
    });
    return res;
  }

  async calculateAttendance(date: string, userEmail: string) {
    const filter = await this.findAllByDateAndEmail(date, userEmail);

    const checkIn = filter[0].time;
    const checkOut = filter[filter.length - 1].time;

    const rule = await this.prisma.attendanceRule.findMany();
    const onDuty = rule[0].onDutyTime;
    const lateMinute = rule[0].lateMinute;

    const offDuty = rule[0].offDutyTime;

    const time1 = moment(checkIn, 'HH:mm');
    const time2 = moment(onDuty, 'HH:mm').add(lateMinute, 'minutes');

    const diff = time2.diff(time1, 'minutes');

    let stats = '';
    if (filter.length >= 1) {
      if (time1 < time2 || diff === 0) {
        stats = 'Early';
      } else {
        stats = 'Late';
      }
    } else {
      stats = 'Absent';
    }

    const offTime1 = moment(checkOut, 'HH:mm');
    const offTime2 = moment(offDuty, 'HH:mm');

    let offStats = '';
    if (offTime1 < offTime2) {
      offStats = 'Leave Early';
    } else {
      offStats = 'Leave On Time';
    }

    await this.prisma.users.update({
      where: { email: filter[0].userEmail },
      data: { checkIn: checkIn, checkOut: checkOut },
    });
    if (filter.length > 1) {
      await this.prisma.historicAtt.updateMany({
        where: { AND: [{ date: date }, { userEmail: filter[0].userEmail }] },
        data: {
          checkIn: checkIn,
          checkOut: checkOut,
          attendanceStatus: stats,
          checkOutStatus: offStats,
        },
      });
    } else {
      await this.prisma.historicAtt.updateMany({
        where: { AND: [{ date: date }, { userEmail: filter[0].userEmail }] },
        data: {
          checkIn: checkIn,
          attendanceStatus: stats,
        },
      });
    }

    return filter;
  }

  async findAllByLocationAndDate(location: string, date: string) {
    return await this.prisma.attendances.findMany({
      where: { AND: [{ location: location }, { date: date }] },
    });
  }

  async findAllByLocation(location: string) {
    return await this.prisma.attendances.findMany({
      where: { location: location },
    });
  }

  async deleteOne(id: number) {
    return await this.prisma.attendances.delete({ where: { id } });
  }
}
