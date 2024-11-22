'use client';

import { FinanceBalance } from '@/app/(app)/dashboard/components/FinanceBalance/FinanceBalance';
import { FinanceList } from '@/app/(app)/dashboard/components/FinanceList/FinanceList';
import { FinanceTracker } from '@/app/(app)/dashboard/components/FinanceTracker/FinanceTracker';
import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';

export const Dashboard = (): JSX.Element => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handlers = useSwipeable({
    onSwipedLeft: () =>
      setCurrentIndex((prev: number) => Math.min(prev + 1, 1)),
    onSwipedRight: () =>
      setCurrentIndex((prev: number) => Math.max(prev - 1, 0)),
  });

  return (
    <div
      {...handlers}
      className="size-full overflow-hidden sm:grid sm:grid-cols-2 sm:overflow-auto"
    >
      <div
        className={`flex w-[200%] transition-transform duration-300 sm:w-full`}
        style={{ transform: `translateX(-${currentIndex * 50}%)` }}
      >
        <div className="flex h-full w-1/2">
          <FinanceBalance />
        </div>
        <div className="flex h-full w-1/2">
          <FinanceList />
        </div>
        <FinanceTracker />
      </div>
    </div>
  );
};
