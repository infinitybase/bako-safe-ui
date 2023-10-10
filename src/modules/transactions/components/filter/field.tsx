import { Text } from '@chakra-ui/react';

export interface TransactionFilterFieldProps {
  value: string;
  label: string;
  selectedValue?: string;
  onChange?: (value: string) => void;
}

const TransactionFilterField = ({
  value,
  selectedValue,
  label,
  onChange,
}: TransactionFilterFieldProps) => (
  <Text
    color={value === selectedValue ? 'brand.500' : 'grey.200'}
    onClick={() => onChange?.(value)}
    fontWeight="medium"
    cursor="pointer"
  >
    {label}
  </Text>
);

export { TransactionFilterField };
