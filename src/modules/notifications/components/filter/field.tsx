import { Text } from '@chakra-ui/react';

export interface NotificationsFilterFieldProps {
  value: string;
  label: string;
  selectedValue?: string;
  onChange?: (value: string) => void;
}

const NotificationsFilterField = ({
  value,
  selectedValue,
  label,
  onChange,
}: NotificationsFilterFieldProps) => (
  <Text
    color={value === selectedValue ? 'brand.500' : 'grey.200'}
    onClick={() => onChange?.(value)}
    fontWeight="medium"
    cursor="pointer"
  >
    {label}
  </Text>
);

export { NotificationsFilterField };
