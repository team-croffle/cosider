import { ApiProperty } from '@nestjs/swagger';

export class OAuthResponseDto {
  @ApiProperty({ example: 'eyJhb...' })
  accessToken: string;

  @ApiProperty({ example: 60 * 60 * 24, description: 'Access Token 만료 시간(초)' })
  expiresIn: number;

  @ApiProperty({ example: true, description: '신규 가입 여부' })
  isNewUser: boolean;
}
