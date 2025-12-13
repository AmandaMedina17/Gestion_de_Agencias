import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserRole } from '../../../DomainLayer/Enums';

@Entity('users')
export class UserOrmEntity {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ type: 'enum', enum: UserRole })
  role!: UserRole;

  @Column()
  isActive!: boolean;

  @Column()
  agency!: string;

  @Column()
  artist!: string;

}
