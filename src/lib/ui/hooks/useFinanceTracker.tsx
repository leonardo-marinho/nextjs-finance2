import {
  FinanceTrackerContext,
  FinanceTrackerContextData,
} from '@/lib/ui/contexts/FinanceTracker.context';
import { useContext } from 'react';

export const useFinanceTracker = (): FinanceTrackerContextData => {
  const context = useContext(FinanceTrackerContext);

  if (context === undefined)
    throw new Error(
      'useFinanceTracker must be used within a FinanceTrackerContextProvider',
    );

  return context;
};
