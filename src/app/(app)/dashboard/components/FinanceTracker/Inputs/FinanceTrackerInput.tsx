import { Input, InputProps } from '@/lib/ui/components/Input';
import { Label } from '@/lib/ui/components/Label';
import { ChangeEvent } from 'react';

export interface FinanceTrackerInputProps
  extends Omit<InputProps, 'name' | 'onChange'> {
  label: string;
  name: Required<InputProps['name']>;
  onChange: (value: string) => void;
}

export const FinanceTrackerInput = ({
  name,
  id: inputId = name,
  label,
  onChange,
  type,
  ...props
}: FinanceTrackerInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void =>
    onChange(e.target.value);

  if (type === 'number') props.inputMode = 'decimal';

  return (
    <div className="flex flex-1 flex-col gap-2">
      <Label htmlFor={inputId}>{label}</Label>
      <Input
        {...props}
        className="block w-full"
        id={inputId}
        name={name}
        onChange={handleChange}
        type={type}
      />
    </div>
  );
};
