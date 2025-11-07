// import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
// import { LoginUseCase } from '../../ApplicationLayer/uses_cases/LoginUseCase';
// import { LoginDto } from '../../PresentationLayer/dtos/request/LoginDto';
// import { JwtStrategy } from '../../InfraestructureLayer/database/Security/JWTStrategy';

// interface AuthenticatedUser {
//   id: string;
//   username: string;
//   role: string;
//   name: string;
// }

// interface RequestWithUser extends Request {
//   user: AuthenticatedUser;
// }

// @Controller('auth')
// export class AuthController {
//   constructor(private readonly loginUseCase: LoginUseCase) {}

//   @Post('login')
//   async login(@Body() loginDto: LoginDto) {
//     return this.loginUseCase.execute(loginDto);
//   }

//   @Get('profile')
//   @UseGuards(JwtStrategy)
//   getProfile(@Request() req: RequestWithUser) { // ✅ Tipo explícito
//     return req.user;
//   }

//   @Post('validate')
//   @UseGuards(JwtStrategy)
//   validateToken(@Request() req: RequestWithUser) { // ✅ También tipado
//     return { 
//       valid: true, 
//       message: 'Token válido',
//       user: req.user // ✅ Acceso seguro al usuario
//     };
//   }
// }