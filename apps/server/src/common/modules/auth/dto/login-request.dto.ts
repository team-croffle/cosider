import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginRequestDto {
  /**
   * 사용자 이메일
   * @example test@example.com
   */
  @IsEmail()
  readonly email: string;

  /**
   * 사용자 비밀번호
   * @example 12345678
   */
  @IsString()
  @MinLength(8)
  readonly password: string;
}
