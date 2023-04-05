import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserEntity as User } from './user.entity';
import { UserDto } from './dto/user.dto';
import { UsernameDto } from './dto/username.dto';
import { UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { FaceStringDto } from './dto/faceString.dto';

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

  @Post('/json/register')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'JSON file',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async registerJson(@UploadedFile() file) {
    const jsonData = await this.userService.readFromJson(file);
    console.log(jsonData);

    return 'Success';
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

  @Patch('/update/faceString/:email')
  @ApiOkResponse({ type: User })
  async updateFaceString(
    @Param('email') email: string,
    @Body() faceString: FaceStringDto,
  ) {
    return await this.userService.updateFaceString(
      email,
      faceString.faceString,
    );
  }
}
