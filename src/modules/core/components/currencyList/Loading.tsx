import { Flex, Icon, Spinner, Text } from '@chakra-ui/react';

import { Item, ItemProps } from './Item';

interface LoadingProps extends Omit<ItemProps, 'children'> {
  loadingLabel?: string;
  LoadingIcon?: React.ElementType;
}

export const Loading = ({
  LoadingIcon = Spinner,
  loadingLabel = 'Loading...',
  ...props
}: LoadingProps) => {
  return (
    <Item {...props}>
      <Flex alignItems="center" gap={2}>
        <Icon as={LoadingIcon} color="grey.500" />
        <Text>{loadingLabel}</Text>
      </Flex>
    </Item>
  );
};
