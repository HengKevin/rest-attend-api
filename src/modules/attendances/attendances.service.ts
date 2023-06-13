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
    const validateAttendance = await this.validateAttendance(attendance);
    if (validateAttendance.status === false) {
      return validateAttendance.message;
    }
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
    const validEmail = await this.validateUserEmail(userEmail);
    if (!validEmail) {
      return { message: 'Invalid email', status: 400 };
    } else {
      return await this.prisma.attendances.findMany({ where: { userEmail } });
    }
  }

  async findAllByDate(date: string) {
    const validDate = this.validateDate(date);
    if (!validDate) {
      return {
        message: 'Date format is invalid, must be in this format DD-MM-YYYY',
        status: 400,
      };
    }
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
          temperature: filter[filter.length - 1].temperature,
        },
      });
    } else {
      await this.prisma.historicAtt.updateMany({
        where: { AND: [{ date: date }, { userEmail: filter[0].userEmail }] },
        data: {
          checkIn: checkIn,
          attendanceStatus: stats,
          temperature: filter[0].temperature,
        },
      });
    }

    return filter;
  }

  async findAllByDateAndLocationAndUserEmail(
    date: string,
    location: string,
    userEmail: string,
  ) {
    const validLoc = await this.validateLocation(location);
    if (validLoc) {
      return { message: 'Location does not exist', status: 400 };
    }
    const validDate = this.validateDate(date);
    if (!validDate) {
      return {
        message: 'Date format is invalid, must be in this format DD-MM-YYYY',
        status: 400,
      };
    }
    const validEmail = await this.validateUserEmail(userEmail);
    if (!validEmail) {
      return { message: 'Invalid email', status: 400 };
    }
    return await this.prisma.attendances.findMany({
      where: { AND: [{ date }, { location }, { userEmail }] },
    });
  }

  async findAllByDateAndUserEmail(date: string, userEmail: string) {
    const validEmail = await this.validateUserEmail(userEmail);
    if (!validEmail) {
      return { message: 'Invalid email', status: 400 };
    }
    const validDate = this.validateDate(date);
    if (!validDate) {
      return {
        message: 'Date format is invalid, must be in this format DD-MM-YYYY',
        status: 400,
      };
    }
    return await this.prisma.attendances.findMany({
      where: { AND: [{ date }, { userEmail }] },
    });
  }

  async findAllByUserEmailAndLocation(userEmail: string, location: string) {
    const validEmail = await this.validateUserEmail(userEmail);
    if (!validEmail) {
      return { message: 'Invalid Email', status: 400 };
    }
    const validLoc = await this.validateLocation(location);
    if (validLoc) {
      return { message: 'Location does not exist', status: 400 };
    }
    return await this.prisma.attendances.findMany({
      where: { AND: [{ userEmail }, { location }] },
    });
  }

  async findAllByLocationAndDate(location: string, date: string) {
    const validLoc = await this.validateLocation(location);
    if (validLoc) {
      return { message: 'Location does not exist', status: 400 };
    }
    const validDate = this.validateDate(date);
    if (!validDate) {
      return {
        message: 'Date format is invalid, must be in this format DD-MM-YYYY',
        status: 400,
      };
    }
    return await this.prisma.attendances.findMany({
      where: { AND: [{ location: location }, { date: date }] },
    });
  }

  async findAllByLocation(location: string) {
    const validLoc = await this.validateLocation(location);
    if (validLoc) {
      return { message: 'Location does not exist', status: 400 };
    }
    return await this.prisma.attendances.findMany({
      where: { location: location },
    });
  }

  async deleteOne(id: number) {
    const exists = await this.prisma.attendances.findUnique({ where: { id } });
    if (!exists) {
      return { message: 'Attendance does not exist', status: 400 };
    }
    return await this.prisma.attendances.delete({ where: { id } });
  }

  async validateLocation(location: string) {
    const locations = await this.prisma.location.findMany();
    if (locations.find((loc) => loc.name === location)) {
      return false;
    }
    return true;
  }

  validateDate(date: string) {
    const datePattern = /^([0-3][0-9])-([0-1][0-9])-([0-9]{4})$/;
    const match = datePattern.exec(date);

    if (match) {
      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10);

      if (day <= 31 && month <= 12) {
        return true;
      }
    }

    return false;
  }

  async validateUserEmail(userEmail: string) {
    const exists = await this.prisma.users.findUnique({
      where: { email: userEmail },
    });
    if (exists) {
      return true;
    }
    return false;
  }

  hasTimeFormat(str: string): boolean {
    const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
    return timeRegex.test(str);
  }

  async validateAttendance(dto: AttendanceDto) {
    const validDate = this.validateDate(dto.date);
    if (!validDate) {
      return {
        message: 'Date format is invalid, must be in this format DD-MM-YYYY',
        status: false,
      };
    }
    const validEmail = await this.validateUserEmail(dto.userEmail);
    if (!validEmail) {
      return { message: 'Invalid email', status: false };
    }
    const validLoc = await this.validateLocation(dto.location);
    if (validLoc) {
      return { message: 'Location does not exist', status: false };
    }
    const validTime = this.hasTimeFormat(dto.time);
    if (!validTime) {
      return { message: 'Time format is invalid', status: false };
    }
    return { message: 'Valid', status: true };
  }
}
