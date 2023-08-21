import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from '../users/users.service';
import { LocationService } from '../location/location.service';
import { APP_GUARD } from '@nestjs/core';
import { HashPasswordService } from '../utils/hashing-password';
import { RolesGuard } from 'src/auth/role.guard';
import { AuthGuard } from 'src/auth/auth.guard';


@Module({
  providers: [AdminsService, PrismaService, UsersService, LocationService, HashPasswordService,
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
  controllers: [AdminsController],
  exports: [AdminsService],
})
export class AdminsModule { }
