import { IUpdateWorkspaceRequest } from '@cosider/shared';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateWorkspaceRequest implements IUpdateWorkspaceRequest {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  slug!: string;
}
