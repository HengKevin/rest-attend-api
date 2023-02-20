import { Module } from '@nestjs/common';
import { UtilService } from './util.service';

@Module({
  providers: [UtilService],
})
export class UtilModule {}
