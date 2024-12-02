import { Label } from '@/lib/ui/components/Label';
import { Textarea, TextareaProps } from '@/lib/ui/components/Textarea';

interface FinanceTrackerTextareaProps
  extends Omit<TextareaProps, 'name' | 'onChange'> {
  label: string;
  name: Required<TextareaProps['name']>;
  onChange: (value: string) => void;
}

export const FinanceTrackerTextarea = ({
  label,
  name,
  id: inputId = name,
  onChange,
  ...props
}: FinanceTrackerTextareaProps): JSX.Element => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void =>
    onChange(e.target.value);

  return (
    <div className="flex flex-1 flex-col gap-2">
      <Label htmlFor={inputId}>{label}</Label>
      <Textarea
        {...props}
        className="w-full"
        id={inputId}
        name={name}
        onChange={handleChange}
      />
    </div>
  );
};
