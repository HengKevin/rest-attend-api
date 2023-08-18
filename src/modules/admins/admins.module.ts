import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from '../users/users.service';
import { LocationService } from '../location/location.service';

@Module({
  providers: [AdminsService, PrismaService, UsersService, LocationService],
  controllers: [AdminsController],
  exports: [AdminsService],
})
export class AdminsModule {}
