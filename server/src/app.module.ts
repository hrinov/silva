import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Roles } from "./database/database.role.entity";
import { Users } from "./database/database.user.entity";
import { UserController } from "./user/user.controller";
import { UserService } from "./user/user.service";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [Users, Roles],
      synchronize: false,
      logging: true,
    }),
    TypeOrmModule.forFeature([Users, Roles]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
