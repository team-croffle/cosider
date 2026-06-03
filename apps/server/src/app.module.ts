import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { loggerConfig } from './common/configs/logger.config';
import { AuthModule } from './modules/auth/auth.module';
import { TasksModule } from './modules/task/tasks.module';
import { WorkspacesModule } from './modules/workspace/workspace.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    LoggerModule.forRoot(loggerConfig),
    AuthModule,
    WorkspacesModule,
    TasksModule,
  ],
})
export class AppModule {}
