import { Module } from '@nestjs/common';

import { CommonModule } from './common/common.module';
import { DrizzleModule } from './database/drizzle.module';
import { FeatureModule } from './modules/feature.module';

@Module({
  imports: [CommonModule, DrizzleModule, FeatureModule],
})
export class AppModule {}
