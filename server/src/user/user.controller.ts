import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto';
import { Response } from 'express';
import { Users } from 'src/database/database.user.entity';
import { AuthGuard } from 'src/guard/guard.auth';

@Controller()
export class UserController {
  constructor(private readonly appService: UserService) {}

  //   @Post("auth/login")
  //   async login(@Body() userDto: UserDto): Promise<{ access_token: string }> {
  //     const { email, password, name } = userDto;
  //     if (!email || !password || !name)
  //       throw new BadRequestException("Invalid email or password");

  //     try {
  //         const { access_token, refresh_token} = await this.appService.login(userDto);
  //         console.log(access_token, refresh_token);
  //     } catch(error) {
  //         throw new BadRequestException(error);
  //     }
  //   }

  @Post('auth/signup')
  async createUser(
    @Body() userDto: UserDto,
    @Res({ passthrough: true }) response: Response, // Inject Response object
  ): Promise<Users> {
    // Define the return type as User
    const { email, password } = userDto;

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!email || !password || password.length < 6 || !isValidEmail) {
      throw new BadRequestException('Invalid email or password');
    }

    try {
      const user: Users = await this.appService.createUser(userDto);

      // Set cookies in the response
      response.cookie('access_token', user.access_token, { httpOnly: true });
      response.cookie('refresh_token', user.refresh_token, { httpOnly: true });

      return user; // Return the typed user object
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async findUser(@Req() req: Request): Promise<{ user: Users }> {
    const user = (req as any).user as Users;
    return { user };
  }
}
