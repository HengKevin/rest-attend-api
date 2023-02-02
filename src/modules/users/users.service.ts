import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocationService } from '../location/location.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private location: LocationService,
  ) {}

  async create(user: UserDto) {
    return await this.prisma.users.create({ data: user });
  }

  async findAll() {
    return await this.prisma.users.findMany();
  }

  async findOne(email: string) {
    return await this.prisma.users.findUnique({ where: { email } });
  }

  async findAllByLocation() {
    const locations = await this.location.findAll();
    const userArr = [];
    for (const loc of locations) {
      const total = await this.prisma.users.count({
        where: { location: loc.name },
      });
      const users = {
        location: loc.name,
        total: total,
      };
      userArr.push(users);
    }
    return userArr;
  }

  async deleteOne(id: number) {
    return await this.prisma.users.delete({ where: { id } });
  }

  async updateOneName(id: number, name: string) {
    return await this.prisma.users.update({
      where: { id },
      data: { name: name },
    });
  }
}
