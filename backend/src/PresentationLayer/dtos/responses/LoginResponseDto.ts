export class LoginResponseDto {
  token!: string;
  user!: {
    id: string;
    username: string;
    role: string;
    name: string;
  };
}