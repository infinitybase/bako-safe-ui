import { Button, Text } from '@chakra-ui/react';

export interface TransactionFilterFieldProps {
  value: string;
  label: string;
  selectedValue?: string;
  isButton?: boolean;
  onChange?: (value: string) => void;
}

const TransactionFilterField = ({
  value,
  selectedValue,
  label,
  onChange,
  isButton,
}: TransactionFilterFieldProps) => {
  return (
    <>
      {isButton ? (
        <Button
          onClick={() => onChange?.(value)}
          h={9}
          px={3}
          variant="primary"
          size="sm"
          fontWeight="medium"
          cursor="pointer"
        >
          {label}
        </Button>
      ) : (
        <Text
          color={value === selectedValue ? 'brand.500' : 'grey.200'}
          onClick={() => onChange?.(value)}
          fontWeight="medium"
          cursor="pointer"
        >
          {label}
        </Text>
      )}
    </>
  );
};

export { TransactionFilterField };
