import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailResponseDto {
  @ApiProperty({ example: '이메일 인증이 완료되었습니다.' })
  message: string;
}
