import { BadRequestException, Injectable, UnauthorizedException, UseFilters } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';
import { AdminsService } from 'src/modules/admins/admins.service';
import { LoginAdminDto } from './dto/login-admin.dto';
import { Admin, SuperAdmin } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { Payload } from '@prisma/client/runtime';
import { SuperAdminService } from 'src/modules/super-admin/super-admin.service';
import { HashPasswordService } from 'src/modules/utils/hashing-password';


@Injectable()
// @UseFilters(UnauthorizedException)
@UseFilters(HttpExceptionFilter)
export class AuthService {
  constructor(
    private adminsService: AdminsService,
    private jwtService: JwtService,
    private superAdminService: SuperAdminService,
    private hashingService: HashPasswordService
  ) { }

  async validateUserAsAdmin(email: string, pass: string) {
    const admin = await this.adminsService.findOneByEmail(email);
    if (!admin) throw new UnauthorizedException('🚫 Invalid credentail 🚫')
    const hashPassword = admin.password
    const isMatchPassword = await this.hashingService.comparePassword(pass, hashPassword)
    if (!isMatchPassword) throw new BadRequestException("🚫 Incorrect password 🚫")
    // const { password, ...result } = admin;
    return admin;
  }

  async validateUserAsSuperAdmin(email: string, pass: string) {
    const superAdmin = await this.superAdminService.findOneByEmail(email);
    if (!superAdmin) throw new UnauthorizedException('🚫 Invalid credentail 🚫')

    const hashPassword = superAdmin.password
    const isMatchPassword = await this.hashingService.comparePassword(pass, hashPassword)
    if (!isMatchPassword) throw new BadRequestException("🚫 Incorrect password 🚫")
    // const { password, ...result } = admin;
    return superAdmin;
  }

  private async generateAccessToken(user: Admin | SuperAdmin, role: string) {
    const payload = {
      id: user.id,
      role: role,
      username: user.username,
      email: user.email
    } as unknown as Payload
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET, expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME
    });
  }

  private async generateRefreshToken(user: Admin | SuperAdmin, jti: string, role: string) {
    const payload = {
      id: user.id,
      role: role,
      username: user.username,
      email: user.email,
      jti,
    } as unknown as Payload
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET, expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME
    });
  }

  // verifyRefreshToken(refreshToken) {
  //   const payload = verify(refreshToken, process.env.JWT_REFRESH_SECRET) as TokenPayload
  //   return payload
  // }

  private async generateToken(user: Admin | SuperAdmin, jti: string, role: string) {
    const accessToken = await this.generateAccessToken(user, role)
    const refreshToken = await this.generateRefreshToken(user, jti, role)
    // console.log("accessToken:", accessToken);
    // console.log("refreshToken:", refreshToken);
    return { accessToken, refreshToken }
  }


  public async loginAsAdmin(admin: LoginAdminDto) {
    const adminInfo = await this.validateUserAsAdmin(admin.email, admin.password)
    const jti = uuidv4()
    const role = "admin"
    const { accessToken, refreshToken } = await this.generateToken(adminInfo, jti, role)
    return {
      accessToken,
      refreshToken
    }
  }

  public async loginAsSuperAdmin(superAdmin: LoginAdminDto) {
    const adminInfo = await this.validateUserAsSuperAdmin(superAdmin.email, superAdmin.password)
    const jti = uuidv4()
    const role = "super-admin"
    const { accessToken, refreshToken } = await this.generateToken(adminInfo, jti, role)
    return {
      accessToken,
      refreshToken
    }
  }
}
