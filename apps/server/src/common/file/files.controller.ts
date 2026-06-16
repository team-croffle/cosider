import { Controller, Get, HttpStatus, Param, Query, Res } from '@nestjs/common';
import type { Response } from 'express';

import { FileMetadata } from './dto/file-metadata.dto';
import { FilesService } from './files.service';

@Controller('/api/v1/files')
export class FileController {
  constructor(private readonly fileService: FilesService) {}

  @Get(':id')
  // TODO: 여기서 파일 접근 권한 검증 필요
  // @UseGuards(JwtAuthGaurd)
  async getMediaFile(
    @Param('id') fileId: string,
    @Query('action') action: 'redirect' | 'info' = 'redirect',
    @Res() res: Response,
  ): Promise<Response<FileMetadata, Record<string, unknown>> | void> {
    if (action === 'info') {
      const media = await this.fileService.getMediaInfo(fileId);
      return res.status(HttpStatus.OK).json(media);
    }

    const url = await this.fileService.toPresignedUrl(fileId);
    if (!url) {
      return res.status(404).send();
    }
    return res.status(HttpStatus.FOUND).redirect(url);
  }
}
