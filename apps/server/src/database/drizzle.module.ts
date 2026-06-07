import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schema';

export const DB_CONNECTION = 'DB_CONNECTION';

export type DrizzleDB = NodePgDatabase<typeof schema>;

@Global()
@Module({
  providers: [
    {
      provide: DB_CONNECTION,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        // 환경 변수에서 DB URL을 가져옵니다.
        const connectionString = configService.get<string>('DATABASE_URL');

        if (!connectionString) {
          throw new Error('DATABASE_URL is not defined in the environment variables');
        }

        // Connection Pool 설정
        const pool = new Pool({
          connectionString,
          max: 20, // 최대 커넥션 수
        });

        // Health Check
        try {
          await pool.query('SELECT 1');
        } catch (error) {
          console.error('Database connection failed on startup:', error);
          throw error;
        }

        // Drizzle 인스턴스 생성 및 스키마 주입
        return drizzle(pool, { schema });
      },
    },
  ],
  exports: [DB_CONNECTION],
})
export class DrizzleModule {}
