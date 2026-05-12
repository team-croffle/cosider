import { Inject, Injectable } from '@nestjs/common';

import { DB_CONNECTION, type DrizzleDB } from '@/database/drizzle.module';

@Injectable()
export class AuthService {
  constructor(@Inject(DB_CONNECTION) private readonly db: DrizzleDB) {}
}
