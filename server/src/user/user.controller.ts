import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto, LoginDto } from './dto';
import { Response } from 'express';
import { Users } from 'src/database/database.user.entity';
import { AuthGuard } from 'src/guard/guard.auth';

@Controller()
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Post('auth/login')
  async loginUser(
    @Body() userDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Users> {
    try {
      const user = await this.appService.loginUser(userDto);

      response.cookie('access_token', user.access_token, {
        httpOnly: true,
      });
      response.cookie('refresh_token', user.refresh_token, {
        httpOnly: true,
      });

      return user;
    } catch (error) {
      const message = error.message;
      if (message == 'Something went wrong') {
        throw new InternalServerErrorException(message);
      } else {
        throw new BadRequestException(message);
      }
    }
  }

  @Post('auth/signup')
  async createUser(
    @Body() userDto: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Users> {
    try {
      const user: Users = await this.appService.createUser(userDto);

      response.cookie('access_token', user.access_token, { httpOnly: true });
      response.cookie('refresh_token', user.refresh_token, { httpOnly: true });

      return user;
    } catch (error) {
      const message = error.message;
      if (message == 'Something went wrong') {
        throw new InternalServerErrorException(message);
      } else {
        throw new BadRequestException(message);
      }
    }
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async findUser(@Req() req: Request): Promise<{ user: Users }> {
    const user = (req as any).user as Users;
    return { user };
  }
}
