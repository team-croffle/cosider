import type {
  EFileRefType,
  EFileVisibility,
  IFileUploadRequest,
  IFileUploadUrlResponse,
  ILinkDocumentDto,
} from '@cosider/shared';

import type { UploadOptions } from '~/types/storage.type';

export function useFileUpload() {
  const { $api } = useNuxtApp();

  const uploading = ref<boolean>(false);
  const progress = ref<number>(0);
  const error = ref<string | null>(null);

  let currentXhr: XMLHttpRequest | null = null;

  async function getUploadUrl(
    file: File,
    endpoint: string,
    visibility: EFileVisibility,
    refType: EFileRefType,
    refId: string,
  ): Promise<IFileUploadUrlResponse> {
    const body: IFileUploadRequest = {
      originalName: file.name,
      mimeType: file.type,
      fileSize: file.size,
      visibility,
      refType,
      refId,
    };

    const resp = await $api<IFileUploadUrlResponse>(endpoint, {
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
      if (!import.meta.client) {
        return reject(new Error('Storage upload can only be performed on the client side'));
      }
      const xhr = new XMLHttpRequest();
      currentXhr = xhr;

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

  function abortUpload(): void {
    if (currentXhr) {
      currentXhr.abort();
      error.value = 'Upload aborted by user';
      uploading.value = false;
      progress.value = 0;
      currentXhr = null;
    }
  }

  async function linkDocument(uploadToken: string, documentId: string): Promise<void> {
    const body: ILinkDocumentDto = { documentId };
    await $api(`/storage/link/${uploadToken}`, {
      method: 'POST',
      body,
    });
  }

  async function upload({ file, endpoint, visibility, refType, refId, onProgress }: UploadOptions) {
    if (uploading.value) {
      throw new Error('Upload is already in progress.');
    }

    uploading.value = true;
    progress.value = 0;
    error.value = null;

    try {
      const { uploadUrl, uploadToken } = await getUploadUrl(
        file,
        endpoint,
        visibility,
        refType,
        refId,
      );
      await putToStorage(file, uploadUrl, onProgress);
      return { uploadToken };
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Upload failed';
      throw err;
    } finally {
      uploading.value = false;
    }
  }

  return { upload, abortUpload, linkDocument, uploading, progress, error };
}
