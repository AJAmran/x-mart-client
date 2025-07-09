import {
  Select,
  SelectItem,
  SelectSection,
  type SelectProps,
} from "@heroui/select";

type Option = {
  key: string;
  label: string;
  branches?: Option[];
};

interface MySelectProps
  extends Omit<SelectProps<Option>, "children" | "items"> {
  options: Option[];
}

export function MySelect({ options, ...props }: MySelectProps) {
  return (
    <Select {...props}>
      {options.map((option) =>
        option.branches ? (
          <SelectSection key={option.key} title={option.label}>
            {option.branches.map((branch) => (
              <SelectItem key={branch.key}>{branch.label}</SelectItem>
            ))}
          </SelectSection>
        ) : (
          <SelectItem key={option.key}>{option.label}</SelectItem>
        )
      )}
    </Select>
  );
}
