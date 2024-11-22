import { IsEmail, IsString } from 'class-validator';

export class AuthSignInBodyDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
