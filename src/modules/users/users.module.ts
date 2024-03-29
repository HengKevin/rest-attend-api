import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocationService } from '../location/location.service';

@Module({
  providers: [UsersService, PrismaService, LocationService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
