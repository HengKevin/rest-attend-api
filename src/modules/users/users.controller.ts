import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UploadedFile,
  BadRequestException,
  NotFoundException,
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
import { UseFilters, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { FaceStringDto } from './dto/faceString.dto';
import { RolesGuard } from 'src/auth/role.guard';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorateor';
import { AuthGuard } from 'src/auth/auth.guard';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';
import { LocationService } from '../location/location.service';

@Controller('users')
@ApiTags('users')
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly userService: UsersService, private readonly locationService: LocationService) { }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @ApiCreatedResponse({ type: User }) // this ApiCreatedResponse for swagger
  async create(@Body() userDto: UserDto) {
    const exists = await this.userService.findOneByEmail(userDto.email)
    if (exists) {
      return 'Email already exists';
    }

    const allLocations = await this.locationService.findAll()
    const locationNames = allLocations.map(location => location?.name?.toLocaleLowerCase());
    if (locationNames.length === 0) throw new NotFoundException("No matching location found.")
    if (!locationNames.includes(userDto.location.toLocaleLowerCase())) {
      console.log("Location doesn't exist");
      throw new BadRequestException("Location doesn't exist")
    }

    if (!userDto.name) {
      throw new BadRequestException("name is required")
    }

    const face = userDto.faceString;
    const array = face.split(',');
    if (array.length !== 512) {
      throw new BadRequestException('The face string is not valid, must be 512 floats separated by commas');
    }
    return this.userService.create(userDto);
  }

  @Post('/bulk/create')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @ApiCreatedResponse({ type: User, isArray: true })
  async bulkCreate(@Body() userDto: UserDto[]) {
    return await this.userService.bulkCreate(userDto);
  }

  @Post('/json/register')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @ApiOkResponse({ type: User, isArray: true })
  async findAllByLocation() {
    return await this.userService.findAllByLocation();
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @ApiOkResponse({ type: User, isArray: true })
  async findAll() {
    // get all posts in the db    
    return await this.userService.findAll();
  }

  @Get('/v2')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @ApiOkResponse({ type: User, isArray: true })
  async findAllPage() {
    // get all posts in the db
    return await this.userService.findAllPage();
  }

  @UseFilters(HttpExceptionFilter)
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @ApiOkResponse({ type: User })
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    const existingUser = await this.userService.findOneById(+id)
    if (!existingUser) {
      throw new BadRequestException("User not found")
    }
    return await this.userService.deleteOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOkResponse({ type: User })
  async updateOneName(
    @Param('id', ParseIntPipe) id: number,
    @Body() usernameDto: UsernameDto,
  ) {
    return await this.userService.updateOneName(id, usernameDto.username);
  }

  @Patch('/update/faceString/:email')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOkResponse({ type: User })
  async updateFaceString(
    @Param('email') email: string,
    @Body() faceString: FaceStringDto,
  ) {
    const face = faceString.faceString;
    const array = face.split(',');
    if (array.length !== 512) {
      throw new BadRequestException('The face string is not valid, must be 512 floats separated by commas');
    }
    return await this.userService.updateFaceString(
      email,
      faceString.faceString,
    );
  }
}
