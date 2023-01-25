import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AttendanceDto } from './dto/attendance.dto';
import * as moment from 'moment';

@Injectable()
export class AttendancesService {
  constructor(private prisma: PrismaService) {}

  create(attendance: AttendanceDto) {
    return this.prisma.attendances.create({ data: { ...attendance } });
  }

  findAll() {
    return this.prisma.attendances.findMany();
  }

  findAllByUserEmail(userEmail: string) {
    return this.prisma.attendances.findMany({ where: { userEmail } });
  }

  findAllByDate(date: string) {
    return this.prisma.attendances.findMany({ where: { date } });
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

    await this.prisma.users.update({
      where: { email: filter[0].userEmail },
      data: { checkIn: checkIn, checkOut: checkOut },
    });

    return filter;
  }

  findAllByLocationAndDate(location: string, date: string) {
    return this.prisma.attendances.findMany({
      where: { AND: [{ location: location }, { date: date }] },
    });
  }

  findAllByLocation(location: string) {
    return this.prisma.attendances.findMany({
      where: { location: location },
      include: { user: { select: { name: true, email: true } } },
    });
  }

  deleteOne(id: number) {
    return this.prisma.attendances.delete({ where: { id } });
  }

  async calculateAttendanceStatus(date: string, userEmail: string) {
    const filter = await this.findAllByDateAndEmail(date, userEmail);
    const checkIn = filter[0].time;
    const checkOut = filter[filter.length - 1].time;

    const time1 = moment(checkIn, 'HH:mm');
    const time2 = moment(checkOut, 'HH:mm');

    const diff = time2.diff(time1);
    const diffMinute = moment.duration(diff).asMinutes();

    let stats = '';
    if (filter.length > 1) {
      if (diffMinute >= 15) {
        stats = 'Late';
      } else {
        stats = 'Present';
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
      await this.prisma.historicAtt.create({
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
      return stats;
    }
  }
}
