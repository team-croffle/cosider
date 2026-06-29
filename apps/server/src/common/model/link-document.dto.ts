import { ILinkDocumentDto } from '@cosider/shared';
import { Expose } from 'class-transformer';

export class LinkDocumentDto implements ILinkDocumentDto {
  @Expose()
  documentId!: string;

  constructor(data?: Partial<ILinkDocumentDto>) {
    Object.assign(this, data);
  }
}
