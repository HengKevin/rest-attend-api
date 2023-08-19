import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Post, UseFilters, UseGuards, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginAdminDto } from './dto/login-admin.dto';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';
import { LoginSuperAdminDto } from './dto/login-super-admin.dto';


@Controller('auth')
@UseFilters(HttpExceptionFilter)
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) { }


  // @HttpCode(HttpStatus.OK)
  @Post('login-admin')
  async loginAsAdmin(@Body() loginAdminDto: LoginAdminDto) {
    if (!loginAdminDto.email) throw new BadRequestException("Email is required")
    if (!loginAdminDto.password) throw new BadRequestException("Password is required")
    return await this.authService.loginAsAdmin(loginAdminDto);
  }

  @Post('login-superadmin')
  async loginAsSuperAdmin(@Body() loginSuperAdminDto: LoginSuperAdminDto) {
    if (!loginSuperAdminDto.email) throw new BadRequestException("Email is required")
    if (!loginSuperAdminDto.password) throw new BadRequestException("Password is required")
    return await this.authService.loginAsSuperAdmin(loginSuperAdminDto);
  }

}
