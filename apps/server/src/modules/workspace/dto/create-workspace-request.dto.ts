import { ICreateWorkspaceRequest } from '@cosider/shared';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

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

  @IsUrl()
  @IsNotEmpty()
  logo_url!: string;
}
