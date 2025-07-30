import { ListItem, ListItemProps } from '@chakra-ui/react';

export interface ItemProps extends Omit<ListItemProps, 'onSelect' | 'onClick'> {
  isSelected?: boolean;
  isDisabled?: boolean;
  onSelect?: (value: string) => void;
  value?: string;
  children: React.ReactNode;
}

export const Item = ({
  isSelected = false,
  isDisabled = false,
  onSelect,
  value,
  children,
  ...props
}: ItemProps) => {
  return (
    <ListItem
      border="1px solid"
      p={3}
      borderRadius="lg"
      borderColor={isSelected ? 'grey.200' : 'grey.950'}
      _hover={{
        borderColor: 'grey.200',
      }}
      cursor="pointer"
      onClick={() => {
        if (!isDisabled && value) {
          onSelect?.(value);
        }
      }}
      {...props}
    >
      {children}
    </ListItem>
  );
};
