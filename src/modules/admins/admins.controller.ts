import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminsService } from './admins.service';
import { AdminDto } from './dto/admin.dto';

@Controller('admins')
@ApiTags('admin')
export class AdminsController {
  constructor(private readonly adminService: AdminsService) {}

  @Post()
  create(@Body() admin: AdminDto) {
    return this.adminService.create(admin);
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
