import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Roles } from './database.role.entity';

@Entity({ name: 'users' })
export class Users {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  access_token: string;

  @Column()
  refresh_token: string;

  @ManyToOne(() => Roles)
  @JoinColumn({ name: 'role' })
  role: Roles;

  @Column({ default: false })
  blocked: boolean;

  @Column({ default: 0 })
  count: number;
}
