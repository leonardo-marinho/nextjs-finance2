export const isStrictNullOrUndefined = <TValue = unknown>(
  value: null | TValue | undefined,
): boolean => {
  return value === null || value === undefined;
};
