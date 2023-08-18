import { BadRequestException, Injectable, UnauthorizedException, UseFilters } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';
import { AdminsService } from 'src/modules/admins/admins.service';
import { LoginAdminDto } from './dto/login-admin.dto';

@Injectable()
// @UseFilters(UnauthorizedException)
@UseFilters(HttpExceptionFilter)
export class AuthService {
  constructor(
    private adminsService: AdminsService,
    private jwtService: JwtService,
  ) { }

  async validateUser(email: string, pass: string) {
    const admin = await this.adminsService.findOneByEmail(email);
    if (!admin) throw new UnauthorizedException('🚫 Invalid credentail 🚫')
    if (admin.password !== pass) throw new BadRequestException("Incorrect password")
    const { password, ...result } = admin;
    return result;
  }

  public async login(admin: LoginAdminDto) {
    await this.validateUser(admin.email, admin.password)

    const token = await this.generateToken(admin);
    return {accessToken:token };
  }

  private async generateToken(admin) {
    const token = await this.jwtService.signAsync(admin);
    return token;
  }
}
