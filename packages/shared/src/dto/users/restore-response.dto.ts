import { ApiProperty } from '@nestjs/swagger';

export class RestoreResponseDto {
  @ApiProperty({ example: '계정이 복구되었습니다.' })
  message: string;
}
