'use client';

import { FinanceBalance } from '@/app/(app)/dashboard/components/FinanceBalance/FinanceBalance';
import { FinanceList } from '@/app/(app)/dashboard/components/FinanceList/FinanceList';
import { FinanceTracker } from '@/app/(app)/dashboard/components/FinanceTracker/FinanceTracker';
import { Button } from '@/lib/ui/components/Button';
import { useFinanceTracker } from '@/lib/ui/hooks/useFinanceTracker';
import { cn } from '@/lib/ui/utils/classnames';
import { PanelRightClose } from 'lucide-react';
import { PanelRightOpen } from 'lucide-react';
import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';

export const Dashboard = () => {
  const { setShowFinanceTrackerPanel, showFinanceTrackerPanel } =
    useFinanceTracker();

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handlers = useSwipeable({
    onSwipedLeft: () =>
      setCurrentIndex((prev: number) => Math.min(prev + 1, 1)),
    onSwipedRight: () =>
      setCurrentIndex((prev: number) => Math.max(prev - 1, 0)),
  });

  const handleToggleFinanceTrackerPanelClick = (): void =>
    setShowFinanceTrackerPanel(!showFinanceTrackerPanel);

  return (
    <>
      <div
        {...handlers}
        className={cn(
          'flex h-[inherit] w-[200%] gap-2 overflow-hidden transition-transform duration-300',
          'md:w-full md:gap-6 ',
          showFinanceTrackerPanel && 'w-full',
        )}
        style={{ transform: `translateX(-${currentIndex * 50}%)` }}
      >
        <div className="flex h-full w-1/2 overflow-auto lg:w-1/3">
          <FinanceBalance />
        </div>
        <div className="flex h-full w-1/2 overflow-auto lg:w-1/3">
          <FinanceList />
        </div>
        <div className="hidden h-full overflow-auto lg:flex lg:w-1/3">
          <FinanceTracker />
        </div>
      </div>
      <div
        className={cn(
          'fixed left-0 top-0 hidden h-full w-full items-center px-3 py-3 dark:bg-neutral-900 rounded-xl',
          showFinanceTrackerPanel && 'grid',
        )}
      >
        <FinanceTracker />
      </div>
      <Button
        className={
          'absolute bottom-4 left-4 dark:bg-neutral-800 dark:text-neutral-50 lg:hidden'
        }
        onClick={handleToggleFinanceTrackerPanelClick}
        size="icon"
        variant="outline"
      >
        {showFinanceTrackerPanel ? (
          <PanelRightClose className="size-6" />
        ) : (
          <PanelRightOpen className="size-6" />
        )}
      </Button>
    </>
  );
};
