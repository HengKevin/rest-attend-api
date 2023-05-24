import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Delete, Patch } from '@nestjs/common/decorators';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiTags } from '@nestjs/swagger';
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
  findAllPage() {
    return this.locationService.findAllPage();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.locationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() location: LocationDto) {
    return this.locationService.update(+id, location);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.delete(id);
  }
}
