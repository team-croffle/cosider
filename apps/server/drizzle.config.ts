import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  // 1. 이전에 작성하신 schema.ts 파일의 경로를 지정합니다.
  schema: './src/database/schema/index.ts',

  // 2. 마이그레이션 SQL 파일들이 뽑혀 나올 출력 디렉토리입니다.
  out: './drizzle',

  // 3. 사용할 데이터베이스 엔진을 지정합니다.
  dialect: 'postgresql',

  // 4. DB 접속 정보 (환경 변수에서 주입)
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
