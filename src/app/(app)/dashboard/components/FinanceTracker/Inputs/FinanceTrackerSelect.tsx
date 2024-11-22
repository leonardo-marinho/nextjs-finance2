import { Label } from '@/lib/ui/components/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/lib/ui/components/Select';
import { SelectItemData, SelectItemDataValue } from '@/lib/ui/types/Select';

interface FinanceTrackerSelectProps {
  data?: SelectItemData[];
  defaultValue?: SelectItemDataValue;
  id?: string;
  label: string;
  name: string;
  onChange: (value: SelectItemDataValue) => void;
  placeholder: string;
}

export const FinanceTrackerSelect = ({
  data = [],
  defaultValue,
  label,
  name,
  id: inputId = name,
  onChange,
  placeholder,
}: FinanceTrackerSelectProps): JSX.Element => {
  const handleChange = (value: string): void => onChange(value);

  return (
    <div className="flex flex-1 flex-col gap-2">
      <Label htmlFor={inputId}>{label}</Label>
      <Select defaultValue={defaultValue} onValueChange={handleChange}>
        <SelectTrigger id={inputId}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {data.map(({ label, value }: SelectItemData) => (
            <SelectItem key={value} value={String(value)}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
