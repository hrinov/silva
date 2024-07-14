import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  name: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class BlockDto {
  @IsNotEmpty()
  @IsBoolean()
  blocked: boolean;

  @IsNotEmpty()
  @IsNumberString()
  user_id: number;
}
