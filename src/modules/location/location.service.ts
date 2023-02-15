import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocationDto } from './dto/location.dto';

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) {}

  async create(location: LocationDto) {
    return await this.prisma.location.create({ data: { ...location } });
  }

  async findAll(page = 1) {
    const total = await this.prisma.location.count();
    const pages = Math.ceil(total / 10);
    const res = await this.prisma.location.findMany({
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

  async findOne(id: number) {
    return await this.prisma.location.findUnique({ where: { id } });
  }

  async update(id: number, location: LocationDto) {
    return await this.prisma.location.update({
      where: { id },
      data: { ...location },
    });
  }

  async delete(id: number) {
    return await this.prisma.location.delete({ where: { id } });
  }
}
