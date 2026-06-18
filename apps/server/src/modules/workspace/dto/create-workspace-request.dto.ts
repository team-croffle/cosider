import { ICreateWorkspaceRequest } from '@cosider/shared';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWorkspaceRequest implements ICreateWorkspaceRequest {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  uploadUrl!: string | null;

  @IsString()
  uploadToken!: string | null;

  @IsString()
  logoUploadToken!: string | null;
}
