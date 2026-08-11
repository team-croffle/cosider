import { ICreateWorkspaceRequest } from '@cosider/shared';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWorkspaceRequest implements ICreateWorkspaceRequest {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsString()
  @IsOptional()
  description!: string | null;

  @IsString()
  @IsOptional()
  uploadUrl!: string | null;

  @IsString()
  @IsOptional()
  uploadToken!: string | null;
}
