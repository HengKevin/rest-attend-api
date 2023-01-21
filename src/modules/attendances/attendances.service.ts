import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AttendanceDto } from './dto/attendance.dto';

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
    const checkOut = filter[1].time;
    const filter0_id = filter[0].id;
    const filter1_id = filter[1].id;

    console.log(checkIn);
    console.log(checkOut);
    console.log(filter0_id);
    console.log(filter1_id);

    console.log(filter[0]);
    console.log(filter[1]);

    const updateUser = await this.prisma.users.update({
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
}
