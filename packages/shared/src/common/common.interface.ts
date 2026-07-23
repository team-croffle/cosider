import { EFileVisibility } from './common.enum';

/** DB 테이블(media_files) 계약. timestamptz 컬럼은 Date. */
export interface IMediaFile {
  id: string;
  bucketName: string;
  objectKey: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  visibility: EFileVisibility;
  ownerId: string | null;
  createdAt: Date;
}
