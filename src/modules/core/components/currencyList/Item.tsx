import { List, ListItemProps } from 'bako-ui';

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
    <List.Item
      border="1px solid"
      p={3}
      borderRadius="lg"
      borderColor={isSelected ? 'bg.muted/300' : 'bg.muted'}
      _hover={{
        borderColor: 'bg.muted/300',
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
    </List.Item>
  );
};
