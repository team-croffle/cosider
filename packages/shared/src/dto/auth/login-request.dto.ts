import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginRequestDto {
  /**
   * 사용자 이메일
   * @example test@example.com
   */
  @ApiProperty({ example: 'test@example.com', description: '사용자 이메일' })
  @IsEmail()
  readonly email: string;

  /**
   * 사용자 비밀번호
   * @example 12345678
   */
  @ApiProperty({ example: '12345678', description: '사용자 비밀번호' })
  @IsString()
  @MinLength(8)
  readonly password: string;
}
