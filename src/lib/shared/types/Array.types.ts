export type ArrayType<TArray, TElse = never> = TArray extends Array<
  infer TElement
>
  ? TElement
  : TElse;
