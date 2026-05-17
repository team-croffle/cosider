import { ApiProperty } from '@nestjs/swagger';

export class DeactivateResponseDto {
  @ApiProperty({ example: '계정 삭제가 완료되었습니다.' })
  message: string;
}
