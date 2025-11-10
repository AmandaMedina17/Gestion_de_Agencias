import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../../ApplicationLayer/services/auth.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    console.log("adentro de local strategy");
    const result = await this.authService.validateUser({ username, password });
    console.log("LocalStrategy - Resultado:", result);

    if (!result) throw new UnauthorizedException();
    console.log("LocalStrategy - Usuario validado exitosamente");
    return result.user;
  }
}
