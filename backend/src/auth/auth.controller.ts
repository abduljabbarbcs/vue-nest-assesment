import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { Response } from 'express';
import { SignupDto } from './dto/singup.dto';
import { LoginDto } from './dto/login.sto';
import {JwtAuthGuard} from '../guards/auth.guard'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async create(@Body() signupDto: SignupDto, @Res() res: Response) {
    const token = await this.authService.create(signupDto);
    res.cookie('auth_token', token.access_token, {
      httpOnly: false,
      maxAge: 3600000,
      sameSite: false,
      secure: false,
    });
    return res.send({ message: 'Signup successful' });
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request, @Res() res: Response) {
    const message = this.authService.logout(req);
    res.clearCookie('auth_token', {
      httpOnly: false, // Match the same options as when setting the cookiea
      sameSite: false,
      secure: false,
    });
    return res.status(200).send(message);
  }

  @Post('login')
  async findOne(@Body() loginDto: LoginDto, @Res() res: Response) {
    const token = await this.authService.findOne(loginDto);
    res.cookie('auth_token', token.access_token, {
      httpOnly: false,
      maxAge: 3600000,
      sameSite: false,
      secure: false
    });
    return res.status(200).send({ message: 'Login successful', token: token });
  }
}
