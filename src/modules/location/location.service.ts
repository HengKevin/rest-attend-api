import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocationDto } from './dto/location.dto';

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) {}

  async create(location: LocationDto) {
    return await this.prisma.location.create({ data: { ...location } });
  }

  async findAll() {
    return await this.prisma.location.findMany({});
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
