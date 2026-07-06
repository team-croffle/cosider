import type { IPageMetaData } from '@cosider/shared';

type FetcherParams = { page: number; limit: number };
type PaginationResult<T> = { content: T[]; meta: IPageMetaData };

export function usePagination<T>(
  fetcher: (params: FetcherParams) => Promise<PaginationResult<T>>,
  initialLimit = 20,
) {
  const content = ref<T[]>([]) as Ref<T[]>;
  const page = ref(1);
  const limit = ref(initialLimit);
  const meta = ref<IPageMetaData>({} as IPageMetaData);
  const isLoading = ref(false);

  const hasNextPage = computed(() => meta.value.hasMore);

  // 무한 스크롤용 (데이터 이어붙이기)
  async function loadMore() {
    if (!hasNextPage.value || isLoading.value) return;

    isLoading.value = true;
    const nextPage = page.value + 1;

    try {
      const result = await fetcher({ page: nextPage, limit: limit.value });
      content.value.push(...result.content);
      meta.value = result.meta;
    } finally {
      isLoading.value = false;
    }
  }

  // 초기화 및 첫 페이지 조회
  async function refresh() {
    isLoading.value = true;
    page.value = 1;

    try {
      const result = await fetcher({ page: page.value, limit: limit.value });
      content.value = result.content;
      meta.value = result.meta;
    } finally {
      isLoading.value = false;
    }
  }

  return { content, page, limit, meta, isLoading, hasNextPage, loadMore, refresh };
}
