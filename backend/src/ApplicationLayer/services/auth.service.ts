import { Injectable } from "@nestjs/common";
import { AuthPayloadDto } from "@presentation/dtos/request/LoginDto";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserRepository } from "../../InfraestructureLayer/database/Repositories/UserRepository";
import { UserRole } from "../../DomainLayer/Enums";

const fakeUsers = [
  {
    id: 1,
    username: "admin",
    //Contrasena: '123'
    password: "$2b$10$Gb1Zb5p1BjFVcaMMxmOE3ODwAMEN6cOL3DIJ4EN8dD1fZw4pMx7Hu",
    role: "admin",
  },
  {
    id: 2,
    username: "manager",
    // Contraseña: 'manager123'
    password: "$2b$10$mWu/dmsCE3aYsgzGC4zWMebxNwW62N4ykRqnjrajpOQnCk3tsvt8a",
    role: "manager",
  },
  {
    id: 3,
    username: "artist",
    // Contraseña: 'artist123'
    password: "$2b$10$MrtFv6Bkrs0VRHYquZBG6OHH4mXrb7IuziQ9GJKTGDenaX9kUTEvq",
    role: "artist",
  },
];

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository
  ) {}

  async validateUser({ username, password }: AuthPayloadDto) {
    const findUser = await this.userRepository.findByUsername(username);
    //const findUser = fakeUsers.find((user) => user.username === username);
    if (!findUser) return null;

    const isPasswordValid = await bcrypt.compare(password, findUser.password);

    if (isPasswordValid) {
      const { password: _, ...user } = findUser;

      return {
        token: this.jwtService.sign(user),
        user: user,
      };
    }
    return null;
  }

  async hashPassword(password: string): Promise<string> {
    //metodo para hashear contrasenas
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async createUser(userData: {
    username: string;
    password: string;
    role: UserRole;
  }) {
    const hashedPassword = await this.hashPassword(userData.password);

    return this.userRepository.createUser({
      ...userData,
      password: hashedPassword,
    });
  }

  private parseUserRole(roleString: string): UserRole {
    const roleMap: Record<string, UserRole> = {
      admin: UserRole.ADMIN,
      manager: UserRole.AGENCY_MANAGER, // 🆕 Cambiado a AGENCY_MANAGER
      artist: UserRole.ARTIST,
      agency_manager: UserRole.AGENCY_MANAGER,
    };

    const role = roleMap[roleString.toLowerCase()];
    if (!role) {
      throw new Error(
        `Rol inválido: ${roleString}. Roles válidos: admin, manager, artist`
      );
    }
    return role;
  }
}
