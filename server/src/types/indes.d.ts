import { Request } from 'express';
import { Users } from 'src/database/database.user.entity';

declare module 'express' {
  interface Request {
    user?: Users;
  }
}
