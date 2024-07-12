import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { UserDto } from "./dto";
import { Roles } from "src/database/database.role.entity";
import { Users } from "src/database/database.user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(Roles)
    private readonly roleRepository: Repository<Roles>
  ) {}

  //   findUser = async (email: string): Promise<User> => {
  //     const query = {
  //       email,
  //     };
  //     const response: User = await this.UsersModel.findOne(query).lean();

  //     return response;
  //   };

  //   login = async (user: UserDto): Promise<{ access_token: string } | null> => {
  //     const { email, password } = user;
  //     const mongoUser = await this.findUser(email);

  //     if (!mongoUser) return null;

  //     const passwordsMatch = await bcrypt.compare(password, mongoUser.password);

  //     if (!passwordsMatch) return null;

  //     return { access_token: mongoUser.access_token };
  //   };

  createUser = async (
    userDto: UserDto
  ): Promise<{ access_token: string; refresh_token: string }> => {
    const { email, password, name } = userDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const access_token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    const refresh_token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    const role: Roles = await this.roleRepository.findOneOrFail({
      where: { name: "client" },
    });

    const newUser = new Users();
    newUser.email = email;
    newUser.name = name;
    newUser.password = hashedPassword;
    newUser.access_token = access_token;
    newUser.refresh_token = refresh_token;
    newUser.role_id = role;
    newUser.password = hashedPassword;

    await this.userRepository.save(newUser);

    return { access_token, refresh_token };
  };

  //   checkToken = async (access_token): Promise<{ user: User } | null> => {
  //     let decodedToken;
  //     try {
  //       decodedToken = jwt.verify(access_token, process.env.JWT_SECRET) as {
  //         email: string;
  //       };
  //     } catch (e) {
  //       return null;
  //     }

  //     if (!decodedToken?.email) return null;

  //     const mongoUser: User = await this.findUser(decodedToken?.email);
  //     if (!mongoUser) return null;

  //     return { user: mongoUser };
  //   };
}
