import { Global, Inject, Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schema';

import { DB_CONNECTION, PG_POOL } from '@/common/constants';

export type DrizzleDB = NodePgDatabase<typeof schema>;

@Global()
@Module({
  providers: [
    // Postgresql Pool Provider
    // 왜 분리를 했는가? => 하단 Service에서 Pool을 직접 주입받아 사용하려고.
    {
      provide: PG_POOL,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        // 환경 변수에서 DB URL을 가져옵니다.
        const dbHost = configService.getOrThrow<string>('DB_HOST');
        const dbPort = configService.getOrThrow<number>('DB_PORT');
        const dbUser = configService.getOrThrow<string>('DB_USER');
        const dbPassword = configService.getOrThrow<string>('DB_PASSWORD');
        const dbName = configService.getOrThrow<string>('DB_DATABASE');

        // Connection Pool 설정
        const pool = new Pool({
          host: dbHost,
          port: Number(dbPort),
          user: dbUser,
          password: dbPassword,
          database: dbName,
          max: 20, // 최대 커넥션 수
        });

        // Health Check
        try {
          await pool.query('SELECT 1');
          Logger.log('Successfully connected to the database', 'DrizzleModule');
        } catch (error) {
          Logger.error('Database connection failed on startup', error, 'DrizzleModule');
          throw error;
        }

        // Drizzle 인스턴스 생성 및 스키마 주입
        return pool;
      },
    },
    // Drizzle ORM Instance Provider
    {
      provide: DB_CONNECTION,
      inject: [PG_POOL, ConfigService],
      useFactory: (pool: Pool, configService: ConfigService) => {
        const isProduction = configService.get<string>('NODE_ENV') === 'production';

        return drizzle(pool, {
          schema,
          logger: !isProduction,
        });
      },
    },
  ],
  exports: [DB_CONNECTION, PG_POOL],
})
export class DrizzleModule implements OnApplicationShutdown {
  constructor(
    @Inject(PG_POOL) private readonly pool: Pool,
    @Inject(DB_CONNECTION) private readonly db: DrizzleDB,
  ) {}

  async onApplicationShutdown(signal?: string): Promise<void> {
    Logger.log(
      `Application shutting down (Signal: ${signal}). Closing DB pool...`,
      'DrizzleModule',
    );

    if (this.pool) {
      await this.pool.end();
      Logger.log('DB pool closed successfully', 'DrizzleModule');
    }
  }
}
