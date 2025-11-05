import { Entity, PrimaryColumn, Column } from 'typeorm';
import { UserRole } from '@domain/Enums';

@Entity('users')
export class UserOrmEntity {
  @PrimaryColumn()
  id!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ type: 'enum', enum: UserRole })
  role!: UserRole;
}
