import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateWorkspaceRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  slug: string;
}
