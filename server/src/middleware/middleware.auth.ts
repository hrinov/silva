import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Repository } from 'typeorm';
import { Users } from '../database/database.user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const access_token = req.cookies['access_token'];
    const refresh_token = req.cookies['refresh_token'];

    if (!access_token || !refresh_token) {
      next();
    }

    try {
      let user = await this.usersRepository.findOne({
        where: { access_token },
      });

      if (!user || user.refresh_token !== refresh_token) {
        next();
      }

      const isTokenExpired = (token: string): boolean => {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
            [key: string]: any;
          };
          if (decoded.exp && Date.now() >= decoded.exp * 1000) {
            return true;
          }
          return false;
        } catch (error) {
          return true;
        }
      };

      const accessTokenExpired = isTokenExpired(access_token);
      const refreshTokenExpired = isTokenExpired(refresh_token);

      const generateAccessToken = (email: string) => {
        return jwt.sign({ email }, process.env.JWT_SECRET, {
          expiresIn: '10m',
        });
      };

      if (accessTokenExpired) {
        const newAccessToken = generateAccessToken(user.email);
        user.access_token = newAccessToken;
        await this.usersRepository.save(user);

        res.cookie('access_token', newAccessToken, { httpOnly: true });

        if (refreshTokenExpired) {
          res.clearCookie('access_token');
          res.clearCookie('refresh_token');
          throw new ForbiddenException('Refresh token is expired');
        }
      }

      req.user = user;

      next();
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
