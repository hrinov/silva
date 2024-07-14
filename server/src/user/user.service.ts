import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { LoginDto, SignUpDto } from './dto';
import { Roles } from 'src/database/database.role.entity';
import { Users } from 'src/database/database.user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(Roles)
    private readonly roleRepository: Repository<Roles>,
  ) {}

  loginUser = async (user: LoginDto): Promise<Users> => {
    const { email, password } = user;
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { email },
      });
      if (!user) throw new Error('Wrong credentials');
      const { password: userPassword } = user;

      const isPasswordValid = await bcrypt.compare(password, userPassword);

      if (!isPasswordValid) throw new Error('Wrong credentials');
      const { access_token, refresh_token } = this.generateTokens(email);

      user.access_token = access_token;
      user.refresh_token = refresh_token;

      const updatedUser = await this.userRepository.save(user);

      return updatedUser;
    } catch (error) {
      const message = error.message;
      throw new Error(
        message == 'Wrong credentials' ? message : 'Something went wrong',
      );
    }
  };

  createUser = async (userDto: SignUpDto): Promise<Users> => {
    const { email, password, name } = userDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const { access_token, refresh_token } = this.generateTokens(email);

    try {
      const role: Roles = await this.roleRepository.findOneOrFail({
        where: { name: 'client' },
      });

      const user = await this.userRepository.save({
        name,
        email,
        access_token,
        refresh_token,
        role_id: role,
        password: hashedPassword,
      });
      delete user.password;
      return user;
    } catch (error) {
      throw new Error(
        error.code == 23505 ? 'User already exists' : 'Something went wrong',
      );
    }
  };

  generateTokens = (email: string) => {
    const access_token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '10m',
    });
    const refresh_token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });
    return { access_token, refresh_token };
  };
}
