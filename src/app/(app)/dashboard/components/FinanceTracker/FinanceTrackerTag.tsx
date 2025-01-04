import clsx from 'clsx';

interface FinanceTrackerTagProps extends React.PropsWithChildren {
  color?: string;
}

export const FinanceTrackerTag = ({
  children,
  color,
}: FinanceTrackerTagProps) => (
  <span
    className={clsx(
      'inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10',
      color,
    )}
  >
    {children}
  </span>
);
