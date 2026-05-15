import { ApiProperty } from '@nestjs/swagger';

export class SignupResponseDto {
  // 반환 데이터 미정
  @ApiProperty({ example: '가입완료 / 가입 안됨' })
  message: string;
}
