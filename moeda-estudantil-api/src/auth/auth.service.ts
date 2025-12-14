import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from 'src/common/utils/password.utils';
import { JwtPayloadDTO } from './dto/jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(email);

    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const payload: JwtPayloadDTO = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async getUserFromId(id: string) {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async updateCredentials(
    id: string,
    email: string,
    currentPassword: string,
    newPassword: string,
  ) {
    return this.usersService.updateCredentials(
      id,
      email,
      currentPassword,
      newPassword,
    );
  }
}
