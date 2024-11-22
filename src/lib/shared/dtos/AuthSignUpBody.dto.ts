import { IsEmail, IsString } from 'class-validator';

export class AuthSignUpBody {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
