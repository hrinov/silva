import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "roles" })
export class Roles {
  @PrimaryGeneratedColumn()
  role_id: number;

  @Column({ default: "client" })
  name: string;
}
