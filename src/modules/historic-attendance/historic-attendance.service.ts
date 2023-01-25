import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
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

  async findAllByDate(date: string) {
    return await this.prisma.historicAtt.findMany({ where: { date } });
  }

  async findAllByDateAndEmail(date: string, userEmail: string) {
    const res = await this.prisma.historicAtt.findMany({
      where: { AND: [{ date: date }, { userEmail: userEmail }] },
    });
    return res;
  }
  async delete(id: number) {
    return await this.prisma.historicAtt.delete({ where: { id } });
  }
}
