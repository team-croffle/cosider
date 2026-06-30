import { IPageMetaData } from '@cosider/shared';
import { Expose } from 'class-transformer';

export class PageMetaData implements IPageMetaData {
  @Expose()
  currentPage!: number;

  @Expose()
  limit!: number;

  @Expose()
  totalCount!: number;

  @Expose()
  hasMore!: boolean;

  constructor(data?: Partial<IPageMetaData>) {
    Object.assign(this, data);
  }
}
