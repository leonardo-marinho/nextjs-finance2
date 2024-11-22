import { FinanceTrackerTag } from '@/app/(app)/dashboard/components/FinanceTracker/FinanceTrackerTag';
import { ComboBox } from '@/lib/ui/components/ComboBox';
import { Label } from '@/lib/ui/components/Label';
import { useFinanceTracker } from '@/lib/ui/hooks/useFinanceTracker';
import { SelectItemData } from '@/lib/ui/types/Select';
import { ReactNode, useState } from 'react';

interface FinanceTrackerComboBoxProps
  extends Omit<React.ComponentPropsWithoutRef<typeof ComboBox>, 'items'> {
  defaultValue?: string;
  label: string;
  name: string;
  onCategoryChange?: (category: string) => void;
  onTagsChange?: (tags: string) => void;
}

export const FinanceTrackerComboBox = ({
  label,
  name,
  onCategoryChange,
  onTagsChange,
  ...props
}: FinanceTrackerComboBoxProps): JSX.Element => {
  const [value, setValue] = useState<string>(props?.defaultValue || '');
  const { options, optionsSelectItems, transaction } = useFinanceTracker();
  const [items, setItems] = useState<ReactNode[]>([]);
  const handleChange = (tags: string, categoryName?: string): void => {
    onTagsChange?.(tags);
    setValue(tags);

    if (!onCategoryChange || !categoryName) return;

    const category = optionsSelectItems?.categories.find(
      (data: SelectItemData) => data.label === categoryName,
    );

    if (!category?.value) return;

    // onCategoryChange(category.value);
  };
  const handleSearchValueChange = (searchValue: string): void => {
    const tags = options?.tags;

    if (!searchValue.length || !tags) return;

    let matchedKeys = Object.keys(tags).filter((key: string) =>
      key.includes(searchValue),
    );
    matchedKeys = matchedKeys.slice(0, 3);

    const CustomLabel = ({
      category,
      tagsString,
    }: {
      category?: string;
      tagsString: string;
    }): JSX.Element => (
      <div
        className="flex w-full gap-1"
        onClick={() => handleChange(tagsString)}
      >
        {tagsString
          .split(',')
          .filter((tag: string) => !!tag?.length)
          .map((tag: string) => (
            <FinanceTrackerTag key={`${tagsString}-${tag}-${category}`}>
              {tag}
            </FinanceTrackerTag>
          ))}
      </div>
    );

    const customTags = (
      <CustomLabel
        category={transaction.Category?.name}
        tagsString={searchValue}
      />
    );

    let newItems = matchedKeys
      .map((tagsString: string): ReactNode[] =>
        tags[tagsString].map((category: string) => (
          <div
            className="flex w-full gap-1"
            key={`${tagsString}-${category}`}
            onClick={() => handleChange(tagsString, category)}
          >
            <FinanceTrackerTag color="bg-yellow-300 text-black">
              {category}
            </FinanceTrackerTag>
            {tagsString
              .trim()
              .split(',')
              .map((tag: string) => (
                <FinanceTrackerTag key={`${tagsString}-${tag}-${category}`}>
                  {tag}
                </FinanceTrackerTag>
              ))}
          </div>
        )),
      )
      .flat();

    if (!matchedKeys.find((key: string) => key === searchValue))
      newItems = [customTags, ...newItems];

    setItems(newItems);
  };

  return (
    <div className="flex flex-1 flex-col gap-2">
      <Label>{label}</Label>
      <ComboBox
        {...props}
        items={items}
        onSearchValueChange={handleSearchValueChange}
        value={
          <div className="flex gap-1">
            {value
              ? (value as string)
                  .trim()
                  .split(',')
                  .map((tag: string) => (
                    <FinanceTrackerTag key={`value-${tag}`}>
                      {tag}
                    </FinanceTrackerTag>
                  ))
              : undefined}
          </div>
        }
      />
    </div>
  );
};
