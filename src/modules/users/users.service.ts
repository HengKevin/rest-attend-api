import { BadRequestException, Injectable, NotFoundException, UseFilters } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocationService } from '../location/location.service';
import { Multer } from 'multer';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';

export type Admin = any;
@Injectable()
@UseFilters(HttpExceptionFilter)
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private location: LocationService,
  ) { }

  private readonly admins = [
    {
      userId: 1,
      email: 'hengratanakvisoth20@kit.edu.kh',
      password: 'password',
    },
    {
      userId: 2,
      email: 'haiseanghor20@kit.edu.kh',
      password: 'password',
    },
  ];

  async create(user: UserDto) {
    return await this.prisma.users.create({
      data: {
        name: user.name,
        email: user.email,
        location: user.location,
        faceString: user.faceString,
      },
    });
  }

  async bulkCreate(users: UserDto[]) {
    for (const data of users) {
      const exists = await this.prisma.users.findUnique({
        where: { email: data.email },
      });

      const allLocations = await this.findAll()
      const locationNames = allLocations.map(location => location?.name?.toLocaleLowerCase());
      const face = data.faceString;
      const array = face.split(',');

      if (exists || locationNames.length === 0 || !locationNames.includes(data.location.toLocaleLowerCase()) || !data.name || array.length !== 512) {
        continue;
      }
      await this.prisma.users.create({
        data: {
          name: data.name,
          email: data.email,
          location: data.location,
          faceString: data.faceString,
        },
      });
    }
    return 'Success';
  }

  async findAll() {
    return await this.prisma.users.findMany();
  }

  async findAllPage() {
    const total = await this.prisma.users.count();
    const pages = Math.ceil(total / 10);
    const res = await this.prisma.users.findMany({});
    return {
      data: res,
      pagination: {
        totalPages: pages,
      },
    };
  }

  async findOneByEmail(email: string) {
    return await this.prisma.users.findUnique({ where: { email } });
  }
  async findOneById(id: number) {
    return await this.prisma.users.findUnique({ where: { id } });
  }

  // async findAdminByEmail(email: string): Promise<Admin | undefined> {
  //   const foundAdmin = this.admins.find((admin) => admin.email === email);
  //   console.log(foundAdmin);
  //   return foundAdmin;
  // }

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

  async readFromJson(file: Multer.File): Promise<any> {
    const jsonData = JSON.parse(file.buffer.toString('utf8'));
    for (const data of jsonData) {
      const exists = await this.prisma.users.findUnique({
        where: { email: data.email },
      });
      const allLocations = await this.findAll()
      const locationNames = allLocations.map(location => location?.name?.toLocaleLowerCase());
      const face = data.faceString;
      const array = face.split(',');


      if (exists || locationNames.length === 0 || !locationNames.includes(data.location.toLocaleLowerCase()) || !data.name || array.length !== 512) {
        continue;
      } else {
        const user = {
          name: data.name,
          email: data.email,
          location: data.location,
          faceString: data.faceString,
        };
        await this.prisma.users.create({ data: user });
      }
    }
    return 'Success';
  }

  async updateFaceString(email: string, faceString: string) {
    return await this.prisma.users.update({
      where: { email },
      data: { faceString },
    });
  }
}
