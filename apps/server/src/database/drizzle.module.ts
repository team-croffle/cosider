import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schema';

// 의존성 주입(DI)에 사용할 토큰
export const DB_CONNECTION = 'DB_CONNECTION';

// 다른 서비스에서 사용할 완벽한 타입 추론을 위한 DB 타입 Export
export type DrizzleDB = NodePgDatabase<typeof schema>;

@Global() // 💡 전역 모듈로 설정하여 다른 모듈의 imports 배열에 넣을 필요 없게 만듭니다.
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

        // 실무 환경을 위한 Connection Pool 설정
        const pool = new Pool({
          connectionString,
          max: 20, // 최대 커넥션 수 (프로젝트 규모에 맞게 조절)
        });

        // Health Check
        try {
          await pool.query('SELECT 1');
        } catch (error) {
          console.error('❌ Database connection failed on startup:', error);
          throw error; // 에러를 던져서 NestJS 서버 부팅을 중단시킴
        }

        // Drizzle 인스턴스 생성 및 스키마 주입
        return drizzle(pool, { schema });
      },
    },
  ],
  exports: [DB_CONNECTION], // 💡 다른 서비스에서 DB_CONNECTION 토큰을 쓸 수 있게 내보냅니다.
})
export class DrizzleModule {}
