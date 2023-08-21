import { BadRequestException, Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Delete, Patch, UseFilters } from '@nestjs/common/decorators';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiTags } from '@nestjs/swagger';
import { LocationDto } from './dto/location.dto';
import { LocationService } from './location.service';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorateor';

@Controller('location')
@ApiTags('location')
@UseFilters(HttpExceptionFilter)
export class LocationController {
  constructor(private readonly locationService: LocationService) { }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  async create(@Body() location: LocationDto) {
    const existingName = await this.locationService.findOneByName(location.name)
    if (existingName) {
      throw new BadRequestException("Name already exist")
    }
    return this.locationService.create(location);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  findAll() {
    return this.locationService.findAll();
  }

  @Get('/v2')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  findAllPage() {
    return this.locationService.findAllPage();
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  async findOne(@Param('id') id: number) {
    return await this.locationService.findOneById(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  async updateLocationName(@Param('id') id: number, @Body() location: LocationDto) {
    const existingName = await this.locationService.findOneByName(location.name)
    if (existingName) {
      throw new BadRequestException("Name already exist")
    }
    return await this.locationService.update(+id, location);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.locationService.delete(+id);
  }
}
