import { EJobRole, ICreateUserProfileRequest } from '@cosider/shared';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProfileRequest implements ICreateUserProfileRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  handle!: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  nickname!: string | null;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  techStacks!: string[] | null;

  @IsEnum(EJobRole)
  jobRole!: EJobRole;

  @IsString()
  @IsOptional()
  uploadToken!: string | null;
}
