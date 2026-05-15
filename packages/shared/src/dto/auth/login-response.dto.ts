import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhb.', description: '서버에서 발급한 JWT Access Token' })
  readonly accessToken: string;

  @ApiProperty({ example: 'eyJhb.', description: '서버에서 발급한 JWT Refresh Token' })
  readonly refreshToken: string;

  @ApiProperty({ example: 60 * 60 * 24, description: 'Access Token 만료 시간(초)' })
  readonly expiresIn: number;
}
