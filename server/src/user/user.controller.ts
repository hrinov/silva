import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto, LoginDto, BlockDto } from './dto';
import { Request, Response } from 'express';
import { Users } from 'src/database/database.user.entity';
import { AuthGuard } from 'src/guard/guard.auth';

@Controller()
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Post('login')
  async loginUser(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Users> {
    try {
      const user = await this.appService.loginUser(dto);

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

  @Post('signup')
  async createUser(
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Users> {
    try {
      const user: Users = await this.appService.createUser(dto);

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
  @UseGuards(new AuthGuard())
  async findUser(@Req() req: Request): Promise<{ user: Users }> {
    const user = req.user as Users;
    return { user };
  }

  @Put('block')
  @UseGuards(new AuthGuard('admin'))
  async handleBlockUser(@Body() dto: BlockDto): Promise<{ success: boolean }> {
    const { blocked, user_id } = dto;
    try {
      const updatedUser: Users = await this.appService.blockUser(dto);

      return { success: !!updatedUser };
    } catch (error) {
      const message = error.message;
      if (message == 'Something went wrong') {
        throw new InternalServerErrorException(message);
      } else {
        throw new BadRequestException(message);
      }
    }
  }
}
