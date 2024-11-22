import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/lib/ui/components/DropdownMenu';
import { Input } from '@/lib/ui/components/Input';
import React, { Fragment, ReactNode, useRef, useState } from 'react';

interface ComboBoxProps extends React.ComponentProps<typeof DropdownMenu> {
  items: ReactNode[];
  onSearchValueChange?: (searchValue: string) => void;
  placeholder?: string;
  value?: ReactNode;
}

export const ComboBox = ({
  items,
  onSearchValueChange,
  placeholder,
  value,
  ...props
}: ComboBoxProps): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState<string>('');

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    onSearchValueChange?.(event.target.value);
    setSearchValue(event.target.value);
  };

  const handleInputFocusMissing = (): void => inputRef.current?.focus();

  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>
        <div className="flex h-9 w-full items-center rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-500 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300">
          {value || placeholder}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-full">
        <DropdownMenuLabel>Filter</DropdownMenuLabel>
        <Input
          autoFocus={true}
          className="rounded-none border-0 border-b focus:border-0 focus:outline-none"
          defaultValue={searchValue}
          onChange={handleInputChange}
          ref={inputRef}
        />
        {items.map((children: ReactNode, index: number) => (
          <Fragment key={index}>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              key={index}
              onFocus={handleInputFocusMissing}
              tabIndex={-1}
            >
              {children}
            </DropdownMenuItem>
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
