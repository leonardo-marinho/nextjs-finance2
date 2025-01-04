'use client';
import { transactionSupportedYears } from '@/lib/shared/constants/Transaction';
import { Button } from '@/lib/ui/components/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/lib/ui/components/Select';
import { useDashboard } from '@/lib/ui/hooks/useDashboard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export const DashboardHeader = () => {
  const { currDate, updateRefDate } = useDashboard();

  const [monthFilter, setMonthFilter] = useState<string>(
    String(currDate.getMonth() + 1),
  );
  const [yearFilter, setYearFilter] = useState<string>(
    String(currDate.getFullYear()),
  );

  useEffect(() => {
    updateRefDate(new Date(Number(yearFilter), Number(monthFilter) - 1));
  }, [monthFilter, yearFilter]);

  const handlePrevMonthClick = (): void => {
    const prevMonth = Number(monthFilter) - 1;
    const prevYear = Number(yearFilter);

    if (prevMonth === 0) {
      setMonthFilter('12');
      setYearFilter(String(prevYear - 1));
    } else setMonthFilter(String(prevMonth));
  };

  const handleNextMonthClick = (): void => {
    const nextMonth = Number(monthFilter) + 1;
    const nextYear = Number(yearFilter);

    if (nextMonth === 13) {
      setMonthFilter('1');
      setYearFilter(String(nextYear + 1));
    } else setMonthFilter(String(nextMonth));
  };

  return (
    <div className="mb-6 flex flex-col items-center justify-between gap-3 lg:flex-row">
      <h1 className="text-3xl font-bold">Finance Dashboard</h1>
      <div className="flex items-center space-x-2">
        <Button onClick={handlePrevMonthClick} size="icon" variant="outline">
          <ChevronLeft className="size-4" />
        </Button>
        <Select onValueChange={setMonthFilter} value={String(monthFilter)}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={'ALL'}>All</SelectItem>
            <SelectItem value={`1`}>January</SelectItem>
            <SelectItem value={`2`}>February</SelectItem>
            <SelectItem value={`3`}>March</SelectItem>
            <SelectItem value={`4`}>April</SelectItem>
            <SelectItem value={`5`}>May</SelectItem>
            <SelectItem value={`6`}>June</SelectItem>
            <SelectItem value={`7`}>July</SelectItem>
            <SelectItem value={`8`}>August</SelectItem>
            <SelectItem value={`9`}>September</SelectItem>
            <SelectItem value={`10`}>October</SelectItem>
            <SelectItem value={`11`}>November</SelectItem>
            <SelectItem value={`12`}>December</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={setYearFilter} value={String(yearFilter)}>
          <SelectTrigger className="w-20">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {transactionSupportedYears.map((year: number) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleNextMonthClick} size="icon" variant="outline">
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
};
