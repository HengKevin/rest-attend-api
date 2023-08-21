import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AdminsService } from 'src/modules/admins/admins.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminsModule } from 'src/modules/admins/admins.module';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { SuperAdminService } from 'src/modules/super-admin/super-admin.service';
import { HashPasswordService } from 'src/modules/utils/hashing-password';
import { RolesGuard } from './role.guard';
import { APP_GUARD } from '@nestjs/core/constants';
import { AuthGuard } from './auth.guard';


@Module({
  imports: [
    AdminsModule,
    PassportModule,
    JwtModule.register({
      global: true
    }),
    // JwtModule.register({
    //   secret: process.env.JWT_ACCESS_EXPIRATION_TIME,
    //   signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME},
    // }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    SuperAdminService,
    HashPasswordService,
    AdminsService,
    PrismaService,
    JwtStrategy,
  
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
  controllers: [AuthController],
})
export class AuthModule { }
