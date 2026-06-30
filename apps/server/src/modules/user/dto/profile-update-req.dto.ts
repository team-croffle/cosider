import { EJobRole, IUserProfileUpdateRequest } from '@cosider/shared';
import { IsArray, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UserProfileUpdateRequest implements IUserProfileUpdateRequest {
  @IsString()
  @MinLength(3)
  @MaxLength(10)
  @IsOptional()
  nickname?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  techStacks?: string[];

  @IsOptional()
  @IsEnum(EJobRole)
  jobRole?: EJobRole;
}
