import { Module } from '@nestjs/common';

import { FileController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  controllers: [FileController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
