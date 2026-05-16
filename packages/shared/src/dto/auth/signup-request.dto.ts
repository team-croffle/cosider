import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SignupRequestDto {
  @ApiProperty({ example: 'user@exam.com', description: 'email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345678', description: 'pwassword' })
  password: string;
}
