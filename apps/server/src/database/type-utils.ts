/**
 * 컴파일 타임에 두 타입이 동일한지 검사한다.
 * Drizzle `$inferSelect`와 shared entity interface를 묶을 때 사용.
 */
export type AssertEqual<T, U> =
  (<G>() => G extends T ? 1 : 2) extends <G>() => G extends U ? 1 : 2
    ? (<G>() => G extends U ? 1 : 2) extends <G>() => G extends T ? 1 : 2
      ? true
      : false
    : false;

export type AssertSchema<TInfer, TEntity> =
  AssertEqual<TInfer, TEntity> extends true
    ? true
    : {
        error: 'Drizzle $inferSelect does not match shared entity interface';
        infer: TInfer;
        entity: TEntity;
      };
