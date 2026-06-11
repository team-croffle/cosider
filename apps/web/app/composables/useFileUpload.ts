import type { FileUploadRequest, FileUploadUrlResponse, LinkDocumentDto } from '@cosider/shared';

import type { UploadOptions } from '~/types/storage.type';

export function useFileUpload() {
  const { $api } = useNuxtApp();

  const uploading = ref<boolean>(false);
  const progress = ref<number>(0);
  const error = ref<string | null>(null);

  async function getUploadUrl(file: File, endpoint: string): Promise<FileUploadUrlResponse> {
    const body: FileUploadRequest = {
      fileName: file.name,
      contentType: file.type,
      fileSize: file.size,
    };

    const resp = await $api<FileUploadUrlResponse>(endpoint, {
      method: 'POST',
      body,
    });

    return resp;
  }

  function putToStorage(
    file: File,
    uploadUrl: string,
    onProgress?: (p: number) => void,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          progress.value = percent;
          onProgress?.(percent);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200 || xhr.status === 204) {
          resolve();
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      });
      xhr.addEventListener('error', () => reject(new Error('Network error')));
      xhr.addEventListener('abort', () => reject(new Error('Aborted')));

      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  }

  async function linkDocument(uploadToken: string, documentId: string): Promise<void> {
    const body: LinkDocumentDto = { documentId };
    await $api(`/storage/link/${uploadToken}`, {
      method: 'POST',
      body,
    });
  }

  async function upload({ file, endpoint, onProgress }: UploadOptions) {
    uploading.value = true;
    progress.value = 0;
    error.value = null;

    try {
      const { uploadUrl, uploadToken } = await getUploadUrl(file, endpoint);
      await putToStorage(file, uploadUrl, onProgress);
      return { uploadToken };
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Upload failed';
      throw err;
    } finally {
      uploading.value = false;
    }
  }

  return { upload, linkDocument, uploading, progress, error };
}
