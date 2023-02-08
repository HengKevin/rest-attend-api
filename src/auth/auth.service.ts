import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminsService } from 'src/modules/admins/admins.service';

@Injectable()
export class AuthService {
  constructor(
    private adminsService: AdminsService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const admin = await this.adminsService.findOneByEmail(email);

    if (admin && admin.password === pass) {
      const { password, ...result } = admin;
      return result;
    }
    return null;
  }

  public async login(admin) {
    const token = await this.generateToken(admin);
    return { admin, token };
  }

  private async generateToken(admin) {
    const token = await this.jwtService.signAsync(admin);
    return token;
  }
}
