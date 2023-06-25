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
import { ApiAcceptedResponse, ApiTags } from '@nestjs/swagger';
import { AttendanceRuleService } from './attendance-rule.service';
import { AttendanceRuleDto } from './dto/attendance-rule.dto';

@Controller('attendance-rule')
@ApiTags('attendance-rule')
export class AttendanceRuleController {
  constructor(private readonly attendanceRuleService: AttendanceRuleService) {}

  @Post()
  @ApiAcceptedResponse({ type: AttendanceRuleService })
  create(@Body() attendanceRuleDto: AttendanceRuleDto) {
    return this.attendanceRuleService.create(attendanceRuleDto);
  }

  @Patch('/:id')
  @ApiAcceptedResponse({ type: AttendanceRuleService })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() attendanceRuleDto: AttendanceRuleDto,
  ) {
    return this.attendanceRuleService.update(id, attendanceRuleDto);
  }

  @Delete()
  @ApiAcceptedResponse({ type: AttendanceRuleService })
  deleteAll() {
    return this.attendanceRuleService.deleteAll();
  }

  @Delete(':id')
  @ApiAcceptedResponse({ type: AttendanceRuleService })
  deleteOne(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceRuleService.deleteOne(id);
  }

  @Get()
  @ApiAcceptedResponse({ type: AttendanceRuleService })
  findAll() {
    return this.attendanceRuleService.findAll();
  }

  @Get(':id')
  @ApiAcceptedResponse({ type: AttendanceRuleService })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceRuleService.findOne(id);
  }
}
