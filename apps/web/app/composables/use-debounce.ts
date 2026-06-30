// 짧은 시간에 연속으로 발생하는 Event(Typing, Resize, Scroll 등)에 대해 불필요한 작업을 방지(연산 최적화)
// 일정 delay 시간 동안 Event가 발생하지 않으면 last로 받은 Event 정보로 Callback을 실행한다.
// 사용 예시: const checkSlug = useDebounce((slug) => { $api(...) }, 500);
export function useDebounce<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number = 300,
) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
