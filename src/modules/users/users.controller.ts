import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
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

  @Post('/bulk/create')
  @ApiCreatedResponse({ type: User, isArray: true })
  async bulkCreate(@Body() userDto: UserDto[]) {
    return await this.userService.bulkCreate(userDto);
  }

  @Get('/paginated')
  @ApiQuery({ name: 'page', required: false })
  async findAllPaginated(@Query('page') page) {
    return await this.userService.findAllPaginated(page);
  }

  @Get('level/users')
  @ApiOkResponse({ type: User, isArray: true })
  async findAllByLevel(@Query('level') level: string) {
    return await this.userService.findAllByLevel(level);
  }

  @Get()
  @ApiOkResponse({ type: User, isArray: true })
  async findAll() {
    // get all posts in the db
    return await this.userService.findAll();
  }

  @Delete(':id')
  @ApiOkResponse({ type: User })
  async deleteOne(@Param('id') id: string) {
    return await this.userService.deleteOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: User })
  async updateOneName(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('level') level: string,
    @Body('teacher') teacher: string,
    @Body('fatherName') fatherName: string,
    @Body('fatherNumber') fatherNumber: string,
    @Body('fatherChatId') fatherChatId: string,
    @Body('motherNumber') motherNumber: string,
    @Body('motherChatId') motherChatId: string,
  ) {
    const update = await this.userService.updateOneUser(id, {
      name,
      level,
      teacher,
      fatherNumber,
      fatherChatId,
      motherNumber,
      motherChatId,
    });
    return update;
  }
}
