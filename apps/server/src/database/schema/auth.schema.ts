import { IRefreshToken } from '@cosider/shared';
import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';

import { users } from './user.schema';

type RefreshTokenSchema = Record<keyof IRefreshToken, unknown>;

export const refreshTokens = pgTable('refresh_tokens', {
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  tokenValue: uuid('token_value').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  revokedAt: timestamp('revoked_at', { withTimezone: true }),
} satisfies RefreshTokenSchema);
