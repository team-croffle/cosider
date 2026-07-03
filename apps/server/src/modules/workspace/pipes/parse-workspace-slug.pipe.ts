import {
  ArgumentMetadata,
  Inject,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { DB_CONNECTION } from '@/common/constants';
import type { DrizzleDB } from '@/database/drizzle.module';
import { workspaces } from '@/database/schema';

@Injectable()
export class ParseWorkspaceSlugPipe implements PipeTransform<string, Promise<string>> {
  constructor(@Inject(DB_CONNECTION) private readonly db: DrizzleDB) {}

  async transform(value: string, _: ArgumentMetadata): Promise<string> {
    if (!value) {
      throw new NotFoundException('WORKSPACE_NOT_FOUND');
    }

    const [workspace] = await this.db
      .select({ id: workspaces.id })
      .from(workspaces)
      .where(eq(workspaces.slug, value));

    if (!workspace) {
      throw new NotFoundException('WORKSPACE_NOT_FOUND');
    }

    return workspace.id;
  }
}
