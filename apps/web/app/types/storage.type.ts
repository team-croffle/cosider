import type { EFileRefType, EFileVisibility } from '@cosider/shared';

export interface UploadOptions {
  file: File;
  endpoint: string;
  visibility: EFileVisibility;
  refType: EFileRefType;
  refId: string;
  onProgress?: (percent: number) => void;
}
