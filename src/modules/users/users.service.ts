import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocationService } from '../location/location.service';
import { Multer } from 'multer';
import { readFileSync } from 'fs';

export type Admin = any;
@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private location: LocationService,
  ) {}

  private readonly admins = [
    {
      userId: 1,
      email: 'ouk.sovannratana19@kit.edu.kh',
      password: 'password',
    },
    {
      userId: 2,
      email: 'heng.kevin19@kit.edu.kh',
      password: 'password',
    },
  ];

  async create(user: UserDto) {
    const valid = await this.validateUser(user);
    if (valid.status === true) {
      return await this.prisma.users.create({
        data: {
          name: user.name,
          email: user.email,
          location: user.location,
          faceString: user.faceString,
        },
      });
    }
    throw new HttpException(valid.message, HttpStatus.BAD_REQUEST);
  }

  async bulkCreate(users: UserDto[]) {
    for (const data of users) {
      const exists = await this.prisma.users.findUnique({
        where: { email: data.email },
      });

      if (exists) {
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

  async findOne(email: string) {
    return await this.prisma.users.findUnique({ where: { email } });
  }

  async findAdminByEmail(email: string): Promise<Admin | undefined> {
    const foundAdmin = this.admins.find((admin) => admin.email === email);
    console.log(foundAdmin);
    return foundAdmin;
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
    const exist = await this.prisma.users.findUnique({ where: { id } });
    if (!exist) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return await this.prisma.users.delete({ where: { id } });
  }

  async updateOneName(id: number, name: string) {
    const exist = await this.prisma.users.findUnique({ where: { id } });
    const special = this.containsSpecialCharacter(name);
    if (!exist) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (name === '' || special === true || name.toLowerCase() === 'null') {
      throw new HttpException('Name is not valid', HttpStatus.BAD_REQUEST);
    }
    if (this.isStringLengthValid(name, 50) === false) {
      throw new HttpException('Name is too long', HttpStatus.BAD_REQUEST);
    }
    return await this.prisma.users.update({
      where: { id },
      data: { name: name },
    });
  }

  containsSpecialCharacter(input: string): boolean {
    const specialCharacterPattern = /[!@#$%^&*(),.?":{}|<>]/;
    return specialCharacterPattern.test(input);
  }

  isStringLengthValid(input: string, maxLength: number): boolean {
    return input.length <= maxLength;
  }

  async validateJsonFile(file: Multer.File) {
    try {
      const jsonData = JSON.parse(file.buffer.toString('utf8'));

      if (
        !Array.isArray(jsonData) ||
        jsonData.length === 0 ||
        !jsonData.every((obj) => typeof obj === 'object')
      ) {
        return { message: 'Not the right data', status: false };
      }
      return { message: 'File is valid JSON', status: true };
    } catch (err) {
      return {
        message: err.message,
        status: false,
      };
    }
  }

  async readFromJson(file: Multer.File): Promise<any> {
    const validJson = await this.validateJsonFile(file);
    if (validJson.status === false) {
      throw new HttpException(validJson.message, HttpStatus.BAD_REQUEST);
    }
    const jsonData = JSON.parse(file.buffer.toString('utf8'));
    for (const data of jsonData) {
      const valid = await this.validateUser(data);
      if (valid.status === true) {
        const exists = await this.prisma.users.findUnique({
          where: { email: data.email },
        });
        if (exists) {
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
      } else {
        continue;
      }
      throw new HttpException(valid.message, HttpStatus.BAD_REQUEST);
    }
    return {
      data: jsonData,
      status: HttpStatus.OK,
    };
  }

  async updateFaceString(email: string, faceString: string) {
    const array = faceString.split(',');
    if (array.length !== 512 || faceString === '') {
      return { message: 'The face string is not valid', status: false };
    }
    return await this.prisma.users.update({
      where: { email },
      data: { faceString },
    });
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async validateUser(user: UserDto) {
    const isValidEmail = this.isValidEmail(user.email);
    if (!isValidEmail) {
      return { message: 'Email is not valid', status: false };
    }
    const exists = await this.prisma.users.findUnique({
      where: { email: user.email },
    });
    const locations = await this.prisma.location.findMany();
    if (exists) {
      return { message: 'Email already exists', status: false };
    }
    if (!locations.find((loc) => loc.name === user.location)) {
      return { message: 'Location does not exist', status: false };
    }
    if (user.location === '') {
      return { message: 'Location cannot be empty', status: false };
    }
    if (user.email === '') {
      return { message: 'Email cannot be empty', status: false };
    }
    if (user.name === '') {
      return { message: 'Name cannot be empty', status: false };
    }
    const face = user.faceString;
    const array = face.split(',');
    if (array.length !== 512 || user.faceString === '') {
      return { message: 'The face string is not valid', status: false };
    }
    return { message: 'Success', status: true };
  }
}
