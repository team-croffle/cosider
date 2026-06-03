import { EJobRole } from '@cosider/shared';
import { ApiProperty } from '@nestjs/swagger';

export class UserProfileResponseDto {
  @ApiProperty({ example: 'Maple', description: 'user를 식별하는 핸들' })
  handle: string;

  @ApiProperty({ example: 'Maple', description: 'user를 식별하는 핸들' })
  nickname: string;

  @ApiProperty({
    example: 'https://cdn.cosider.com/profiles/Maple.png',
    description: '프로필 사진 URL',
    required: false,
    nullable: true,
    readOnly: true,
  })
  profile_image_url: string | null;

  @ApiProperty({
    example: ['Java', 'Spring Boot', 'NestJS'],
    description: '기술 스택 array',
    required: false,
    nullable: true,
    type: [String],
  })
  tech_stacks: string[] | null;

  @ApiProperty({
    example: 'BE_DEV',
    description: '직무',
    required: false,
    readOnly: true,
  })
  job_role: EJobRole;
}
