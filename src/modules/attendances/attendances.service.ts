import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AttendanceDto } from './dto/attendance.dto';
import * as moment from 'moment';

@Injectable()
export class AttendancesService {
  constructor(private prisma: PrismaService) {}

  async create(attendance: AttendanceDto) {
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
          temperature: filter[filter.length - 1].temperature,
          location: filter[0].location,
        },
      });
    } else {
      await this.prisma.historicAtt.updateMany({
        where: { AND: [{ date: date }, { userEmail: filter[0].userEmail }] },
        data: {
          checkIn: checkIn,
          attendanceStatus: stats,
          temperature: filter[0].temperature,
          location: filter[0].location,
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

  async calculateAttendanceStatus(date: string, userEmail: string) {
    const filter = await this.findAllByDateAndEmail(date, userEmail);
    const rule = await this.prisma.attendanceRule.findMany();
    const onDuty = rule[0].onDutyTime;
    const lateMinute = rule[0].lateMinute;
    const checkIn = filter[0].time;
    const checkOut = filter[filter.length - 1].time;

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
    await this.prisma.users.update({
      where: { email: filter[0].userEmail },
      data: { attendanceStatus: stats },
    });
    const exist = await this.prisma.historicAtt.findMany({
      where: {
        AND: [{ date: date }, { userEmail: filter[0].userEmail }],
      },
    });
    if (exist.length > 0) {
      return stats;
    } else {
      return await this.prisma.historicAtt.create({
        data: {
          date: date,
          temperature: filter[0].temperature,
          location: filter[0].location,
          checkIn: checkIn,
          checkOut: checkOut,
          attendanceStatus: stats,
          userEmail: filter[0].userEmail,
        },
      });
    }
  }
}
