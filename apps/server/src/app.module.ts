import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { loggerConfig } from './common/configs/logger.config';
import { FilesModule } from './common/file/files.module';
import { MinioModule } from './common/minio/minio.module';
import { RedisModule } from './common/redis/redis.module';
import { DrizzleModule } from './database/drizzle.module';
import { AuthModule } from './modules/auth/auth.module';
import { TasksModule } from './modules/task/tasks.module';
import { WorkspacesModule } from './modules/workspace/workspace.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env', '../../.env'],
    }),
    LoggerModule.forRoot(loggerConfig),
    FilesModule,
    MinioModule,
    RedisModule,
    DrizzleModule,
    AuthModule,
    WorkspacesModule,
    TasksModule,
  ],
})
export class AppModule {}
