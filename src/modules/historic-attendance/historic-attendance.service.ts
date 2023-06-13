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
    const valid = await this.validHist(history);
    if (valid.status === false) {
      return valid.message;
    }
    return await this.prisma.historicAtt.create({ data: { ...history } });
  }

  async findAll() {
    return await this.prisma.historicAtt.findMany();
  }

  async findAllPage() {
    const total = await this.prisma.historicAtt.count();
    const pages = Math.ceil(total / 10);
    const res = await this.prisma.historicAtt.findMany({});
    return {
      data: res,
      pagination: {
        totalPages: pages,
      },
    };
  }

  async findAllByUserEmail(userEmail: string) {
    const emailFormat = this.isValidEmail(userEmail);
    if (!emailFormat) {
      return 'Email is not valid';
    }
    const validEmail = await this.validateUserEmail(userEmail);
    if (!validEmail) {
      return 'Email does not exist';
    }
    return await this.prisma.historicAtt.findMany({ where: { userEmail } });
  }

  async findAllByDateAndEmail(date: string, userEmail: string) {
    if (date === '' || userEmail === '') {
      return 'Date and Email must not be empty';
    }
    const emailFormat = this.isValidEmail(userEmail);
    if (!emailFormat) {
      return 'Email is not valid';
    }
    const valid = await this.validateDate(date);
    if (!valid) {
      return 'Date does not exist';
    }
    const validEmail = await this.validateUserEmail(userEmail);
    if (!validEmail) {
      return 'Email does not exist';
    }
    return await this.prisma.historicAtt.findUnique({
      where: { date_userEmail: { date, userEmail } },
    });
  }

  async findAllByDate(date: string) {
    if (date === '') {
      return 'Date must not be empty';
    }
    const valid = await this.validateDate(date);
    if (!valid) {
      return 'Date does not exist';
    }
    return await this.prisma.historicAtt.findMany({ where: { date } });
  }

  async findAllByDatePage(date: string) {
    const total = await this.prisma.historicAtt.count({ where: { date } });
    const pages = Math.ceil(total / 10);
    const his = await this.prisma.historicAtt.findMany({
      where: { date },
    });
    return {
      data: his,
      pagination: {
        totalPages: pages,
      },
    };
  }

  async delete(id: number) {
    if (id === null || id === undefined) {
      return 'Id must not be empty';
    }
    const exist = await this.prisma.historicAtt.findUnique({ where: { id } });
    if (!exist) {
      return 'Historic Attendance does not exist';
    }
    return await this.prisma.historicAtt.delete({ where: { id } });
  }

  async findAllByLocation(location: string) {
    if (location === '') {
      return 'Location must not be empty';
    }
    const special = this.containsSpecialCharacter(location);
    if (special) {
      return 'Location must not contain special characters';
    }
    const validLoc = await this.validateLocation(location);
    if (!validLoc) {
      return 'Location does not exist';
    }
    return await this.prisma.historicAtt.findMany({
      where: { location: location },
    });
  }

  async findOneByDateAndEmail(date: string, userEmail: string) {
    return await this.prisma.attendances.findMany({
      where: { AND: [{ date: date }, { userEmail: userEmail }] },
    });
  }

  async findAllByDateStatus(date: string, status: string) {
    const validDate = await this.validateDate(date);
    if (!validDate) {
      return 'Date does not exist';
    }
    const validStatus = await this.isValidStatus(status);
    if (!validStatus) {
      return 'Status does not exist';
    }
    return await this.prisma.historicAtt.findMany({
      where: { AND: [{ date: date }, { attendanceStatus: status }] },
    });
  }

  async findAllByDateStatusPage(date: string, status: string) {
    const total = await this.prisma.historicAtt.count({
      where: { AND: [{ date: date }, { attendanceStatus: status }] },
    });
    const pages = Math.ceil(total / 10);
    const res = await this.prisma.historicAtt.findMany({
      where: { AND: [{ date: date }, { attendanceStatus: status }] },
    });
    return {
      data: res,
      pagination: {
        totalPages: pages,
      },
    };
  }

  async findAllByLocationStatus(location: string, status: string) {
    const validLoc = await this.validateLocation(location);
    if (!validLoc) {
      return 'Location does not exist';
    }
    const validStatus = await this.isValidStatus(status);
    if (!validStatus) {
      return 'Status does not exist';
    }
    return await this.prisma.historicAtt.findMany({
      where: { AND: [{ location: location }, { attendanceStatus: status }] },
    });
  }

  async findAllByLocationStatusPage(location: string, status: string) {
    const validLoc = await this.validateLocation(location);
    if (!validLoc) {
      return 'Location does not exist';
    }
    const total = await this.prisma.historicAtt.count({
      where: { AND: [{ location: location }, { attendanceStatus: status }] },
    });
    const pages = Math.ceil(total / 10);
    const res = await this.prisma.historicAtt.findMany({
      where: { AND: [{ location: location }, { attendanceStatus: status }] },
    });
    return {
      data: res,
      pagination: {
        totalPages: pages,
      },
    };
  }

  async markAbsentAttendance(
    date: string,
    userEmail: string,
    location: string,
  ) {
    const validLoc = await this.validateLocation(location);
    if (!validLoc) {
      return 'Location does not exist';
    }
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
    const validDate = await this.validateDate(date);
    if (!validDate) {
      return 'Date does not exist';
    }
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
    return await this.prisma.historicAtt.findMany({
      where: {
        AND: [
          { date: date },
          { attendanceStatus: status },
          { location: location },
        ],
      },
    });
  }

  async filterStatusByLocationDatePage(
    date?: string,
    location?: string,
    status?: string,
  ) {
    const total = await this.prisma.historicAtt.count({
      where: { date: date },
    });
    const pages = Math.ceil(total / 10);
    const res = await this.prisma.historicAtt.findMany({
      where: {
        AND: [
          { date: date },
          { attendanceStatus: status },
          { location: location },
        ],
      },
    });
    return {
      data: res,
      pagination: {
        totalPages: pages,
      },
    };
  }

  async findAllByLocationDate(location: string, date: string) {
    const validLoc = await this.validateLocation(location);
    if (!validLoc) {
      return 'Location does not exist';
    }
    return await this.prisma.historicAtt.findMany({
      where: { AND: [{ location: location }, { date: date }] },
    });
  }

  async findAllByLocationDatePage(location: string, date: string) {
    const validLoc = await this.validateLocation(location);
    if (!validLoc) {
      return 'Location does not exist';
    }
    const total = await this.prisma.historicAtt.count({
      where: { AND: [{ location: location }, { date: date }] },
    });
    const pages = Math.ceil(total / 10);
    const res = await this.prisma.historicAtt.findMany({
      where: { AND: [{ location: location }, { date: date }] },
    });
    return {
      data: res,
      pagination: {
        totalPages: pages,
      },
    };
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
    if (location === '') {
      return 'Location must not be empty';
    }
    const validLoc = await this.validateLocation(location);
    if (!validLoc) {
      return 'Location does not exist';
    }
    const validStartDate = await this.validateDate(startDate);
    const validEndDate = await this.validateDate(endDate);
    if (!validStartDate || !validEndDate) {
      return 'Date does not exist';
    }
    const data = [];
    const users = await this.prisma.users.findMany({
      where: { location: location },
    });
    for (const user of users) {
      const count = await this.prisma
        .$queryRaw`SELECT COUNT(*) FROM public."HistoricAtt" as htp JOIN public."Users" as users ON htp."userEmail" = users.email WHERE to_date(htp.date, 'dd-mm-yyyy') BETWEEN to_date(${startDate}, 'dd-mm-yyyy') AND to_date(${endDate}, 'dd-mm-yyyy') AND users.email = ${user.email} AND htp."location" = ${location}`;
      const total = Number(count[0].count);
      const lateCount = await this.prisma
        .$queryRaw`SELECT COUNT(*) FROM public."HistoricAtt" as htp JOIN public."Users" as users ON htp."userEmail" = users.email WHERE to_date(htp.date, 'dd-mm-yyyy') BETWEEN to_date(${startDate}, 'dd-mm-yyyy') AND to_date(${endDate}, 'dd-mm-yyyy') AND users.email = ${user.email} AND htp."attendanceStatus" = 'Late' AND htp."location" = ${location}`;
      const late = Number(lateCount[0].count);
      const absentCount = await this.prisma
        .$queryRaw`SELECT COUNT(*) FROM public."HistoricAtt" as htp JOIN public."Users" as users ON htp."userEmail" = users.email WHERE to_date(htp.date, 'dd-mm-yyyy') BETWEEN to_date(${startDate}, 'dd-mm-yyyy') AND to_date(${endDate}, 'dd-mm-yyyy') AND users.email = ${user.email} AND htp."attendanceStatus" = 'Absent' AND htp."location" = ${location}`;
      const absent = Number(absentCount[0].count);
      data.push({
        date: startDate + ' - ' + endDate,
        name: user.name,
        email: user.email,
        total: total,
        late: late,
        absent: absent,
        percentage:
          String(Math.round(((total - absent) / total) * 100)) + ' ' + '%',
      });
    }
    const res = await this.excel.downloadExcelByLocation(data, location);
    return res;
  }

  async exportDataByDateRangeUsers(
    startDate: string,
    endDate: string,
    users: string[],
  ) {
    const data = [];
    for (const user of users) {
      const name = await this.prisma
        .$queryRaw`SELECT name FROM public."Users" as users WHERE users.email = ${user}`;
      const count = await this.prisma
        .$queryRaw`SELECT COUNT(*) FROM public."HistoricAtt" as htp JOIN public."Users" as users ON htp."userEmail" = users.email WHERE to_date(htp.date, 'dd-mm-yyyy') BETWEEN to_date(${startDate}, 'dd-mm-yyyy') AND to_date(${endDate}, 'dd-mm-yyyy') AND users.email = ${user}`;
      const total = Number(count[0].count);
      const lateCount = await this.prisma
        .$queryRaw`SELECT COUNT(*) FROM public."HistoricAtt" as htp JOIN public."Users" as users ON htp."userEmail" = users.email WHERE to_date(htp.date, 'dd-mm-yyyy') BETWEEN to_date(${startDate}, 'dd-mm-yyyy') AND to_date(${endDate}, 'dd-mm-yyyy') AND users.email = ${user} AND htp."attendanceStatus" = 'Late'`;
      const late = Number(lateCount[0].count);
      const absentCount = await this.prisma
        .$queryRaw`SELECT COUNT(*) FROM public."HistoricAtt" as htp JOIN public."Users" as users ON htp."userEmail" = users.email WHERE to_date(htp.date, 'dd-mm-yyyy') BETWEEN to_date(${startDate}, 'dd-mm-yyyy') AND to_date(${endDate}, 'dd-mm-yyyy') AND users.email = ${user} AND htp."attendanceStatus" = 'Absent'`;
      const absent = Number(absentCount[0].count);
      data.push({
        date: startDate + ' - ' + endDate,
        name: name,
        email: user,
        total: total,
        late: late,
        absent: absent,
        percentage:
          String(Math.round(((total - absent) / total) * 100)) + ' ' + '%',
      });
    }
    const res = await this.excel.downloadExcelByDateRange(data);
    return res;
  }

  async exportDataByLocationMonth(
    month: number,
    year: number,
    location: string,
  ) {
    if (typeof month !== 'number' || typeof year !== 'number') {
      return 'Month or year must a number';
    }
    if (location === '') {
      return 'Location cannot be empty';
    }
    const validLoc = await this.validateLocation(location);
    if (!validLoc) {
      return 'Location does not exist';
    }
    const validMonth = await this.validMonth(month);
    const validYear = await this.validYear(year);
    if (!validMonth || !validYear) {
      return 'Month or year does not exist';
    }
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const day = startDate.getDate().toString().padStart(2, '0');
    const months = (startDate.getMonth() + 1).toString().padStart(2, '0');
    const years = startDate.getFullYear().toString();
    const startDateStr = `${day}-${months}-${years}`;

    const day2 = endDate.getDate().toString().padStart(2, '0');
    const months2 = (endDate.getMonth() + 1).toString().padStart(2, '0');
    const years2 = endDate.getFullYear().toString();
    const endDateStr = `${day2}-${months2}-${years2}`;

    const data = [];
    const users = await this.prisma.users.findMany({
      where: { location: location },
    });
    for (const user of users) {
      const count = await this.prisma
        .$queryRaw`SELECT COUNT(*) FROM public."HistoricAtt" as htp JOIN public."Users" as users ON htp."userEmail" = users.email WHERE to_date(htp.date, 'dd-mm-yyyy') BETWEEN to_date(${startDateStr}, 'dd-mm-yyyy') AND to_date(${endDateStr}, 'dd-mm-yyyy') AND users.email = ${user.email} AND htp."location" = ${location}`;
      const total = Number(count[0].count);
      const lateCount = await this.prisma
        .$queryRaw`SELECT COUNT(*) FROM public."HistoricAtt" as htp JOIN public."Users" as users ON htp."userEmail" = users.email WHERE to_date(htp.date, 'dd-mm-yyyy') BETWEEN to_date(${startDateStr}, 'dd-mm-yyyy') AND to_date(${endDateStr}, 'dd-mm-yyyy') AND users.email = ${user.email} AND htp."attendanceStatus" = 'Late' AND htp."location" = ${location}`;
      const late = Number(lateCount[0].count);
      const absentCount = await this.prisma
        .$queryRaw`SELECT COUNT(*) FROM public."HistoricAtt" as htp JOIN public."Users" as users ON htp."userEmail" = users.email WHERE to_date(htp.date, 'dd-mm-yyyy') BETWEEN to_date(${startDateStr}, 'dd-mm-yyyy') AND to_date(${endDateStr}, 'dd-mm-yyyy') AND users.email = ${user.email} AND htp."attendanceStatus" = 'Absent' AND htp."location" = ${location}`;
      const absent = Number(absentCount[0].count);
      data.push({
        month: month,
        year: year,
        name: user.name,
        email: user.email,
        total: total,
        late: late,
        absent: absent,
        percentage:
          String(Math.round(((total - absent) / total) * 100)) + ' ' + '%',
      });
    }
    const res = await this.excel.downloadExcelByMonthAndLocation(
      data,
      location,
    );
    return res;
  }

  async validateLocation(location: string) {
    const locations = await this.prisma.location.findMany();
    if (locations.find((loc) => loc.name === location)) {
      return true;
    }
    return false;
  }

  validMonth(month: number): boolean {
    if (month < 1 || month > 12) {
      return false;
    }
    return true;
  }

  validYear(year: number): boolean {
    if (year < 1900 || year > 2100) {
      return false;
    }
    return true;
  }
  hasTimeFormat(str: string): boolean {
    const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
    return timeRegex.test(str);
  }

  isValidStatus(status: string): boolean {
    const statusRegex = /^(Early|Absent|Late)$/;
    return statusRegex.test(status);
  }

  isValidCheckOutStatus(checkOutStatus: string): boolean {
    const statusRegex = /^(Leave On Time|Leave Early)$/;
    return statusRegex.test(checkOutStatus);
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  containsSpecialCharacter(input: string): boolean {
    const specialCharacterPattern = /[!@#$%^&*(),.?":{}|<>]/;
    return specialCharacterPattern.test(input);
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

  async validHist(dto: HistoricAttDto) {
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
    if (!validLoc) {
      return { message: 'Location does not exist', status: false };
    }
    const validStatus = this.isValidStatus(dto.attendanceStatus);
    if (!validStatus) {
      return { message: 'Invalid status', status: false };
    }
    const validCheckOutStatus = this.isValidCheckOutStatus(dto.checkOutStatus);
    if (!validCheckOutStatus) {
      return { message: 'Invalid check out status', status: false };
    }
    const validCheckIn = this.hasTimeFormat(dto.checkIn);
    const validCheckOut = this.hasTimeFormat(dto.checkOut);
    if (!validCheckIn || !validCheckOut) {
      return { message: 'Time format is invalid', status: false };
    }
    return { message: 'Valid', status: true };
  }
}
