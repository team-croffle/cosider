export interface UploadOptions {
  file: File;
  endpoint: string;
  onProgress?: (percent: number) => void;
}
