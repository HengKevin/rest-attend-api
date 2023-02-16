import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Delete, Patch, Query } from '@nestjs/common/decorators';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { LocationDto } from './dto/location.dto';
import { LocationService } from './location.service';

@Controller('location')
@ApiTags('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  create(@Body() location: LocationDto) {
    return this.locationService.create(location);
  }

  @Get()
  findAll() {
    return this.locationService.findAll();
  }

  @Get('/v2')
  @ApiQuery({ name: 'page', required: false })
  findAllPage(@Query('page') page: number) {
    return this.locationService.findAllPage(page);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.locationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() location: LocationDto) {
    return this.locationService.update(id, location);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.delete(id);
  }
}
