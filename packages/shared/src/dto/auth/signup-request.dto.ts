import { ApiProperty } from '@nestjs/swagger';

export class SignupRequestDto {
  @ApiProperty({ example: 'user@exam.com', description: 'email' })
  email: string;

  @ApiProperty({ example: 'user0000', description: 'pwassword' })
  password: string;
}
