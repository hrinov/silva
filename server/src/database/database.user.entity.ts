import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Role } from "./database.role.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @ManyToOne(() => Role)
  role: Role;

  @Column({ default: false })
  blocked: boolean;

  @Column({ default: 0 })
  count: number;
}
