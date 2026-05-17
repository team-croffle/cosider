import { ApiProperty } from '@nestjs/swagger';

export class DeactivateReqeustDto {
  @ApiProperty({ example: 'password123!', description: '본인 확인용 비밀번호', required: false })
  password: string;
}
