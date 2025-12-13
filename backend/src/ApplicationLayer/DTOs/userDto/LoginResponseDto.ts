export class LoginResponseDto {
  token!: string;
  user!: {
    id: string;
    username: string;
    role: string;
    agency: string;
    artist: string;
  };
}