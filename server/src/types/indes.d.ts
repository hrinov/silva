import { Request } from 'express';
import { Users } from 'src/database/database.user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: Users;
    }
  }
}
