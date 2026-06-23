import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { loggerConfig } from './configs/logger.config';
import { FilesModule } from './file/files.module';
import { MinioModule } from './minio/minio.module';
import { RedisModule } from './redis/redis.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`../../.env.${process.env.NODE_ENV || 'development'}.local`, '../../.env'],
    }),
    LoggerModule.forRoot(loggerConfig),
    FilesModule,
    MinioModule,
    RedisModule,
  ],
  exports: [ConfigModule, LoggerModule, FilesModule, MinioModule, RedisModule],
})
export class CommonModule {}
