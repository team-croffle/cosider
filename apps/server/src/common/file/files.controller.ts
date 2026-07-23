import type { IFileUploadUrlResponse } from '@cosider/shared';
import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import type { Response } from 'express';

import { FileUploadRequest } from './dto';
import { FileMetadata } from './dto/file-metadata.dto';
import { FilesService } from './files.service';

import { CurrentUser } from '@/modules/auth/decorator';
import type { AuthenticatedUser } from '@/types/auth';

@Controller('/api/v1/files')
export class FileController {
  constructor(private readonly fileService: FilesService) {}

  @Post('upload-url')
  async getPresignedUrl(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: FileUploadRequest,
  ): Promise<IFileUploadUrlResponse> {
    return await this.fileService.issueUploadToken(user.userId, dto);
  }

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
