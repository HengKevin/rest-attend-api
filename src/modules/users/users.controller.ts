import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserEntity as User } from './user.entity';
import { UserDto } from './dto/user.dto';
@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ type: User })
  create(@Body() userDto: UserDto) {
    return this.userService.create(userDto);
  }

  @Get()
  @ApiOkResponse({ type: User, isArray: true })
  async findAll() {
    // get all posts in the db
    return await this.userService.findAll();
  }

  @Delete(':email')
  @ApiOkResponse({ type: User })
  async deleteOne(@Param('email') email: string) {
    return await this.userService.deleteOne(email);
  }
}
