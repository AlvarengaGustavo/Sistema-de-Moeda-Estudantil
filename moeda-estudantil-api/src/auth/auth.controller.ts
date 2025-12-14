import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto/sign-in.dto';
import { AuthGuard } from './auth.guard';
import { JwtPayloadDTO } from './dto/jwt-payload.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDTO) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getProfile(@Request() req: { user: JwtPayloadDTO }) {
    return this.authService.getUserFromId(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Post('update')
  updateCredentials(
    @Request() req: { user: JwtPayloadDTO },
    @Body()
    body: { email: string; currentPassword: string; newPassword: string },
  ) {
    return this.authService.updateCredentials(
      req.user.sub,
      body.email,
      body.currentPassword,
      body.newPassword,
    );
  }
}
