import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '@presentation/dtos/request/LoginDto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    // 🎯 Endpoint protegido - solo accesible con token válido
    return req.user;
  }

  @Post('validate')
  @UseGuards(JwtAuthGuard)
  validateToken() {
    // 🎯 Endpoint para validar token
    return { valid: true, message: 'Token válido' };
  }
}