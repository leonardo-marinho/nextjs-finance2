import {
  DashboardContext,
  DashboardContextData,
} from '@/lib/ui/contexts/Dashboard.context';
import { useContext } from 'react';

export const useDashboard = (): DashboardContextData => {
  const context = useContext(DashboardContext);

  if (context === undefined)
    throw new Error(
      'useDashboard must be used within a DashboardContextProvider',
    );

  return context;
};
