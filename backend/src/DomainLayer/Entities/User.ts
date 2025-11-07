import { UserRole } from "../Enums";
import { v4 as uuidv4 } from 'uuid';

export class User {
  constructor(
    public readonly id: string,
    public username: string,
    public password: string,
    private role : UserRole,
    public isActive: boolean
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.username) throw new Error("Username requerido");
    if (!this.password) throw new Error("Password requerido");
  }

  static create(username: string, password: string, role : UserRole): User {
    const id = uuidv4();
    return new User(id, username, password, role, true);
  }

  // Getters
  public getId(): string {
    return this.id;
  }

  public getPassword(): string {
    return this.password;
  }

  public getUserName(): string {
    return this.username;
  }

  public getRole(): UserRole {
    return this.role;
  }
}