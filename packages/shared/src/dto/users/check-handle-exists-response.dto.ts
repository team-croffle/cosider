import { ApiProperty } from '@nestjs/swagger';

export class CheckHandleExistsResponseDto {
  @ApiProperty({
    example: true,
    description: '핸들 사용 가능 여부',
  })
  is_available: boolean;
}