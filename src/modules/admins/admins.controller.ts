import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseFilters,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminsService } from './admins.service';
import { AdminDto } from './dto/admin.dto';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';
import { UsersService } from '../users/users.service';

@Controller('admins')
@UseFilters(HttpExceptionFilter)
@ApiTags('admin')
export class AdminsController {
  constructor(
    private readonly adminService: AdminsService,
    private readonly userService: UsersService
  ) { }

  @Post()
  async create(@Body() admin: AdminDto) {
    const existingUser = await this.userService.findOne(admin.email)
    const existingAdmin = await this.adminService.findOneByEmail(admin.email)
    if(existingAdmin || existingUser) throw new BadRequestException("Email alread exist")
    if (!admin.name) throw new BadRequestException("name is required")

    if (!admin.password) throw new BadRequestException('password is required')
    if (admin.password && admin.password.length <= 0) throw new BadRequestException('Password must be greater or equal to 5')
    return await this.adminService.create(admin);
  }

  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Get('/email/:email')
  async findOneByEmail(@Param('email') email: string) {
    const foundEmail = await this.adminService.findOneByEmail(email);
    // const {password, ...res} = foundEmail
    // return res;
    return foundEmail
  }

  @Get('/id/:id')
  async findOneById(@Param('id', ParseIntPipe) id: number) {
    const foundId = await this.adminService.findOneById(id);
    console.log(foundId);
    return foundId;
  }
}
