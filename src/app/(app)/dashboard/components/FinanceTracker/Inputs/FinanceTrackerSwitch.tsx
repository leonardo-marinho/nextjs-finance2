import { Label } from '@/lib/ui/components/Label';
import { Switch, SwitchProps } from '@/lib/ui/components/Switch';

interface FinanceTrackerSwitchProps
  extends Omit<SwitchProps, 'name' | 'onChange'> {
  label: string;
  name: Required<SwitchProps['name']>;
  onChange: (value: boolean) => void;
}

export const FinanceTrackerSwitch = ({
  name,
  id: inputId = name,
  label,
  onChange,
  ...props
}: FinanceTrackerSwitchProps) => (
  <div className="flex flex-1 items-center gap-2">
    <Switch {...props} id={inputId} name={name} onCheckedChange={onChange} />
    <Label htmlFor={inputId}>{label}</Label>
  </div>
);
