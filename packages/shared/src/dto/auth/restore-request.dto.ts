import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class RestoreRequestDto {
  @ApiProperty({ example: 'user@example.com', description: '복구할 계정 이메일' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: '이메일 인증 코드' })
  @IsString()
  code: string;
}
