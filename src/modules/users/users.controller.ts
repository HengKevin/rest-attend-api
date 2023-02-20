import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserEntity as User } from './user.entity';
import { UserDto } from './dto/user.dto';
import { UsernameDto } from './dto/username.dto';
@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ type: User })
  create(@Body() userDto: UserDto) {
    return this.userService.create(userDto);
  }

  @Post('/bulk/create')
  @ApiCreatedResponse({ type: User, isArray: true })
  async bulkCreate(@Body() userDto: UserDto[]) {
    return await this.userService.bulkCreate(userDto);
  }

  @Get('location/users')
  @ApiOkResponse({ type: User, isArray: true })
  async findAllByLocation() {
    return await this.userService.findAllByLocation();
  }

  @Get()
  @ApiOkResponse({ type: User, isArray: true })
  async findAll() {
    // get all posts in the db
    return await this.userService.findAll();
  }

  @Get('/v2')
  @ApiOkResponse({ type: User, isArray: true })
  async findAllPage() {
    // get all posts in the db
    return await this.userService.findAllPage();
  }

  @Delete(':id')
  @ApiOkResponse({ type: User })
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.deleteOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: User })
  async updateOneName(
    @Param('id', ParseIntPipe) id: number,
    @Body() usernameDto: UsernameDto,
  ) {
    return await this.userService.updateOneName(id, usernameDto.name);
  }
}
