import {
  Controller,
  Post,
  Get,
  Body,
  HttpException,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthPayloadDto } from "../../PresentationLayer/dtos/request/LoginDto";
import { AuthService } from "../services/auth.service";
import { LocalGuard } from "../../InfraestructureLayer/guards/local_guard";
import { JwtAuthGuard } from "../../InfraestructureLayer/guards/jwt_guard";
import { Request } from "express";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  @UseGuards(LocalGuard)
  login(@Body() authPayload: AuthPayloadDto) {
    const result = this.authService.validateUser(authPayload);
    if (!result) throw new HttpException("Invalid Credentials", 401);

    return result;
  }

  @Get("status")
  @UseGuards(JwtAuthGuard)
  status(@Req() req: Request) {
    console.log("controlador");
    console.log(req.user);
    return req.user;
  }
}
