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
import { userProfiles } from '@/database/schema';

@Injectable()
export class ParseUserHandlePipe implements PipeTransform<string, Promise<string>> {
  constructor(@Inject(DB_CONNECTION) private readonly db: DrizzleDB) {}

  async transform(value: string, _: ArgumentMetadata): Promise<string> {
    if (!value) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    const [user] = await this.db
      .select({ userId: userProfiles.userId })
      .from(userProfiles)
      .where(eq(userProfiles.handle, value));

    if (!user || !user.userId) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    return user.userId;
  }
}
