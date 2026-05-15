import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailRequestDto {
  @ApiProperty({ example: 'user@exam.com' })
  email: string;

  @ApiProperty({ example: '123456' })
  code: string;
}
