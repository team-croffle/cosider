import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

import { MinioService } from './minio.service';

export const MINIO_CLIENT = 'MINIO_CLIENT';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: MINIO_CLIENT,
      useFactory: (config: ConfigService): Minio.Client => {
        return new Minio.Client({
          endPoint: config.getOrThrow<string>('STORAGE_ENDPOINT'),
          port: config.get('STORAGE_PORT') ? Number(config.get('STORAGE_PORT')) : undefined,
          useSSL: config.get('STORAGE_USE_SSL', 'true') === 'true',
          accessKey: config.getOrThrow<string>('STORAGE_ACCESS_KEY'),
          secretKey: config.getOrThrow<string>('STORAGE_SECRET_KEY'),
          region: config.get<string>('STORAGE_REGION', 'us-ease-1'),
          pathStyle: config.get('STORAGE_PATH_STYLE', 'true') === 'true',
        });
      },
      inject: [ConfigService],
    },
    MinioService,
  ],
  exports: [MINIO_CLIENT, MinioService],
})
export class MinioModule {}
