import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(user: UserDto) {
    return this.prisma.users.create({ data: user });
  }

  findAll() {
    return this.prisma.users.findMany();
  }

  findOne(email: string) {
    return this.prisma.users.findUnique({ where: { email } });
  }

  deleteOne(id: number) {
    return this.prisma.users.delete({ where: { id } });
  }

  updateOneName(id: number, name: string) {
    return this.prisma.users.update({ where: { id }, data: { name: name } });
  }
}
