import { Injectable } from '@nestjs/common';
import { CreateSuperAdminDto } from './dto/create-super-admin.dto';
import { UpdateSuperAdminDto } from './dto/update-super-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class SuperAdminService {
  constructor(private prisma: PrismaService) { }

  create(createSuperAdminDto: CreateSuperAdminDto) {
    return 'This action adds a new superAdmin';
  }

  findAll() {
    return `This action returns all superAdmin`;
  }

  async findOneByEmail(email: string) {
    const foundEmail = await this.prisma.superAdmin.findUnique({
      where: {
        email
      }
    });

    return foundEmail
  }

  update(id: number, updateSuperAdminDto: UpdateSuperAdminDto) {
    return `This action updates a #${id} superAdmin`;
  }

  remove(id: number) {
    return `This action removes a #${id} superAdmin`;
  }
}
