import type { EFileVisibility } from '@cosider/shared';

export interface UploadOptions {
  file: File;
  endpoint: string;
  visibility: EFileVisibility;
  onProgress?: (percent: number) => void;
}
