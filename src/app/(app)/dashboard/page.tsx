import { Dashboard } from '@/app/(app)/dashboard/components/Dashboard';
import { DashboardHeader } from '@/app/(app)/dashboard/components/Header';
import { DashboardProvider } from '@/lib/ui/contexts/Dashboard.context';
import { FinanceTrackerProvider } from '@/lib/ui/contexts/FinanceTracker.context';
import { cn } from '@/lib/ui/utils/classnames';
import { ToastContainer } from 'react-toastify';

const DashboardPage = (): JSX.Element => {
  return (
    <div className={cn('relative flex flex-col p-2 h-screen', 'md:p-6')}>
      <ToastContainer />
      <DashboardProvider>
        <DashboardHeader />
        <FinanceTrackerProvider>
          <Dashboard />
        </FinanceTrackerProvider>
      </DashboardProvider>
    </div>
  );
};

export default DashboardPage;
