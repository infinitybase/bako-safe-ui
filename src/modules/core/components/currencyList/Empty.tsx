import { Text } from '@chakra-ui/react';

import { Item, ItemProps } from './Item';

interface EmptyProps extends Omit<ItemProps, 'children'> {
  emptyMessage?: string;
}

export const Empty = ({
  emptyMessage = 'No currencies found',
  ...rest
}: EmptyProps) => {
  return (
    <Item isDisabled _hover={{}} cursor="auto" {...rest}>
      <Text>{emptyMessage}</Text>
    </Item>
  );
};
