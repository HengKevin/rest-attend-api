import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminDto } from './dto/admin.dto';

@Injectable()
export class AdminsService {
  constructor(private prisma: PrismaService) { }

  async create(admin: AdminDto) {
    return await this.prisma.admin.create({ data: admin });
  }

  async findAll() {
    return await this.prisma.admin.findMany();
  }

  async findOneByEmail(email: string) {
    const foundEmail = await this.prisma.admin.findUnique({
      where: {
        email
      }
    });
    return foundEmail;
  }

  async findOneById(id: number) {
    const foundId = await this.prisma.admin.findUnique({ where: { id } });
    return foundId;
  }
}
