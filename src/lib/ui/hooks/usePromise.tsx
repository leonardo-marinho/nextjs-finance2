import { useCallback, useEffect, useState } from 'react';

interface UsePromiseData {
  isPending: boolean;
  promise: () => Promise<void>;
}

interface UsePromiseProps {
  lazy?: boolean;
}

export const usePromise = (
  promise: () => Promise<void>,
  { lazy }: UsePromiseProps,
): UsePromiseData => {
  const [isPending, setIsPending] = useState<boolean>(false);

  const executePromise = useCallback(async () => {
    setIsPending(true);
    await promise();
    setIsPending(false);
  }, [promise]);

  useEffect(() => {
    if (lazy) return;

    executePromise();
  }, [executePromise, lazy, promise]);

  return { isPending, promise: executePromise };
};
